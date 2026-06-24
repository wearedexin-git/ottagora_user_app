#!/usr/bin/env bash
# Flusso interattivo: branch → status → commit → push
# Uso: ./scripts/git-push-flow.sh
#      npm run git:push

set -euo pipefail

# Evita pager interattivo (es. `:` su git diff --stat)
export GIT_PAGER=cat

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()  { echo -e "${CYAN}$*${NC}"; }
ok()    { echo -e "${GREEN}$*${NC}"; }
warn()  { echo -e "${YELLOW}$*${NC}"; }
err()   { echo -e "${RED}$*${NC}" >&2; }

die() { err "$1"; exit "${2:-1}"; }

confirm() {
  local prompt="$1"
  local reply
  printf "%s [s/N]: " "$prompt"
  read -r reply
  case "$reply" in
    s|S|si|Si|SI|y|Y|yes|Yes|YES) return 0 ;;
    *) return 1 ;;
  esac
}

# Conteggio commit da pushare (sempre un solo intero)
commits_ahead() {
  local remote="${1:-origin}"
  local branch="${2:-$(git branch --show-current)}"
  local count=0

  if git rev-parse --verify "@{u}" >/dev/null 2>&1; then
    count="$(git rev-list --count "@{u}"..HEAD 2>/dev/null || echo 0)"
  elif git rev-parse --verify "${remote}/${branch}" >/dev/null 2>&1; then
    count="$(git rev-list --count "${remote}/${branch}"..HEAD 2>/dev/null || echo 0)"
  else
    count="$(git rev-list --count HEAD 2>/dev/null || echo 0)"
  fi

  # Solo cifre (evita errori [[ ... -gt ... ]] su macOS/bash)
  echo "$count" | tr -cd '0-9'
}

# --- Verifica repository ---
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  die "Non sei in un repository Git."
fi

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

CURRENT_BRANCH="$(git branch --show-current)"
if [[ -z "$CURRENT_BRANCH" ]]; then
  die "HEAD detached: fai checkout su un branch prima di continuare."
fi

UPSTREAM="$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || true)"
DIRTY="$(git status --porcelain | wc -l | awk '{print $1}')"

echo ""
echo -e "${BOLD}=== Git push flow — Ottagora User App ===${NC}"
echo ""
info "Repository: ${ROOT}"
info "Branch attuale: ${BOLD}${CURRENT_BRANCH}${NC}"
if [[ -n "$UPSTREAM" ]]; then
  info "Upstream: ${UPSTREAM}"
else
  warn "Nessun upstream configurato per questo branch."
fi
info "File con modifiche (staged/unstaged/untracked): ${DIRTY}"
echo ""

# --- Scelta branch ---
echo -e "${BOLD}Dove vuoi lavorare?${NC}"
echo "  1) Push sul branch attuale (${CURRENT_BRANCH})"
echo "  2) Crea un nuovo branch e pusha lì"
echo ""
read -r -p "Scelta [1/2] (default 1): " BRANCH_CHOICE
BRANCH_CHOICE="${BRANCH_CHOICE:-1}"

TARGET_BRANCH="$CURRENT_BRANCH"

case "$BRANCH_CHOICE" in
  1|"")
    TARGET_BRANCH="$CURRENT_BRANCH"
    ok "→ Userò il branch: ${TARGET_BRANCH}"
    ;;
  2)
    read -r -p "Nome del nuovo branch: " NEW_BRANCH
    NEW_BRANCH="$(echo "$NEW_BRANCH" | xargs)"
    [[ -n "$NEW_BRANCH" ]] || die "Nome branch obbligatorio."
    if git show-ref --verify --quiet "refs/heads/${NEW_BRANCH}"; then
      warn "Il branch '${NEW_BRANCH}' esiste già."
      confirm "Vuoi fare checkout su quel branch?" || die "Operazione annullata."
      git checkout "$NEW_BRANCH"
    else
      git checkout -b "$NEW_BRANCH"
      ok "Creato e attivato: ${NEW_BRANCH}"
    fi
    TARGET_BRANCH="$NEW_BRANCH"
    CURRENT_BRANCH="$TARGET_BRANCH"
    ;;
  *)
    die "Scelta non valida."
    ;;
esac

echo ""

# --- Avviso branch protetti ---
if [[ "$TARGET_BRANCH" == "main" || "$TARGET_BRANCH" == "master" ]]; then
  warn "Attenzione: stai per committare su '${TARGET_BRANCH}'."
  confirm "Procedere comunque?" || die "Operazione annullata."
fi

# --- Status ---
echo -e "${BOLD}=== git status ===${NC}"
git status
echo ""

if [[ "$(git status --porcelain)" == "" ]]; then
  warn "Nessuna modifica da committare."
  if confirm "Vuoi solo fare push dei commit già presenti?"; then
    :
  else
    die "Niente da fare."
  fi
else
  # --- File sensibili ---
  SENSITIVE="$(git status --porcelain | grep -E '\.(env|pem|key)$|dev\.db|credentials' || true)"
  if [[ -n "$SENSITIVE" ]]; then
    warn "Rilevati file potenzialmente sensibili:"
    echo "$SENSITIVE"
    confirm "Escluderli dallo stage automatico?" && EXCLUDE_SENSITIVE=1 || EXCLUDE_SENSITIVE=0
  else
    EXCLUDE_SENSITIVE=0
  fi

  echo -e "${BOLD}=== Cosa includere nel commit? ===${NC}"
  echo "  1) Tutti i file modificati e nuovi (git add -A)"
  echo "  2) Solo file già tracciati modificati (git add -u)"
  echo "  3) Selezione manuale (git add -p interattivo)"
  echo "  4) Annulla"
  read -r -p "Scelta [1/2/3/4] (default 1): " STAGE_CHOICE
  STAGE_CHOICE="${STAGE_CHOICE:-1}"

  case "$STAGE_CHOICE" in
    1)
      git add -A
      if [[ "$EXCLUDE_SENSITIVE" == "1" ]]; then
        git reset HEAD -- .env dev.db 2>/dev/null || true
        while IFS= read -r f; do
          [[ -n "$f" ]] && git reset HEAD -- "$f" 2>/dev/null || true
        done < <(git status --porcelain | awk '{print $2}' | grep -E '^\.env\.|^.*\.(pem|key)$' || true)
      fi
      ;;
    2) git add -u ;;
    3) git add -p ;;
    4) die "Operazione annullata." ;;
    *) die "Scelta non valida." ;;
  esac

  echo ""
  echo -e "${BOLD}=== Staged (anteprima commit) ===${NC}"
  if [[ -z "$(git diff --cached --name-only)" ]]; then
    die "Nessun file in stage. Aggiungi file e rilancia lo script."
  fi
  git --no-pager diff --cached --stat
  echo ""

  # --- Messaggio commit ---
  echo -e "${BOLD}=== Messaggio di commit ===${NC}"
  echo "Lascia vuoto per usare un messaggio generato automaticamente."
  read -r -p "Messaggio: " COMMIT_MSG

  if [[ -z "$COMMIT_MSG" ]]; then
    COMMIT_MSG="$(git diff --cached --name-only | head -5 | tr '\n' ', ' | sed 's/,$//')"
    COMMIT_MSG="chore: aggiornamenti (${COMMIT_MSG})"
    warn "Messaggio auto: ${COMMIT_MSG}"
    confirm "Va bene?" || read -r -p "Nuovo messaggio: " COMMIT_MSG
    [[ -n "$COMMIT_MSG" ]] || die "Messaggio commit obbligatorio."
  fi

  echo ""
  info "Commit in corso..."
  git commit -m "$COMMIT_MSG"
  ok "Commit creato."
fi

# --- Push ---
echo ""
echo -e "${BOLD}=== Push ===${NC}"

REMOTE="$(git remote | head -1)"
REMOTE="${REMOTE:-origin}"

if [[ -z "$(git remote)" ]]; then
  die "Nessun remote configurato. Aggiungi 'origin' prima del push."
fi

AHEAD="$(commits_ahead "$REMOTE" "$TARGET_BRANCH")"
AHEAD="${AHEAD:-0}"
HAS_UPSTREAM=false
if git rev-parse --verify "@{u}" >/dev/null 2>&1; then
  HAS_UPSTREAM=true
  UPSTREAM="$(git rev-parse --abbrev-ref --symbolic-full-name "@{u}")"
fi

info "Remote: ${REMOTE}"
info "Branch: ${TARGET_BRANCH}"
if [[ -n "${UPSTREAM:-}" ]]; then
  info "Upstream: ${UPSTREAM}"
fi
if [[ "$AHEAD" -gt 0 ]] 2>/dev/null; then
  info "Commit da pushare: ${AHEAD}"
fi

if [[ "$HAS_UPSTREAM" == true ]]; then
  confirm "Eseguire git push (${UPSTREAM})?" || die "Push annullato."
  git push
else
  confirm "Eseguire git push -u ${REMOTE} ${TARGET_BRANCH}?" || die "Push annullato."
  git push -u "${REMOTE}" "${TARGET_BRANCH}"
fi

ok "Push completato su ${REMOTE}/${TARGET_BRANCH}."
echo ""
