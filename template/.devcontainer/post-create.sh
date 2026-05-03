#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

main() {
  configure_local_git
  install_apm
  # install_opencode_cli
  install_1password_cli
  run_deps_install
}

configure_local_git() {
  # Local git prefs only apply inside a repository; skip when there is no .git (avoids postCreate failure).
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    git config --local commit.gpgsign false
    git config --local core.pager 'less -R'
  fi
}

install_apm() {
  # Agent Package Manager: https://github.com/microsoft/apm
  curl -sSL https://aka.ms/apm-unix | sh
}

install_opencode_cli() {
  curl -fsSL https://opencode.ai/install | bash
}

# Optional: Snyk CLI
#   curl --compressed https://static.snyk.io/cli/latest/snyk-linux-arm64 -o snyk
#   chmod +x ./snyk && sudo mv -f ./snyk /usr/local/bin/snyk

install_1password_cli() {
  local op_version="2.32.1"
  curl -fsSL "https://cache.agilebits.com/dist/1P/op2/pkg/v${op_version}/op_linux_arm64_v${op_version}.zip" -o /tmp/op.zip
  python3 -c "import zipfile; zipfile.ZipFile('/tmp/op.zip').extract('op', '/tmp')"
  sudo mv /tmp/op /usr/local/bin/op && chmod +x /usr/local/bin/op && rm /tmp/op.zip
}

run_deps_install() {
  bash "${SCRIPT_DIR}/utils/deps-install.sh"
}

main "$@"
