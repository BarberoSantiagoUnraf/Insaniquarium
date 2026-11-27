let saveHandler = null;

export function configureSaveHandler(handler) {
  saveHandler = typeof handler === 'function' ? handler : null;
}

export async function saveGame(state = {}) {
  if (!saveHandler) {
    return { saved: false, reason: 'not-configured' };
  }

  return saveHandler(state);
}
