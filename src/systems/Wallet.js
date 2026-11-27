export default class Wallet {
  constructor(initialBalance = 0) {
    this.balance = Math.max(0, initialBalance);
    this.listeners = new Set();
  }

  getBalance() {
    return this.balance;
  }

  canAfford(cost) {
    return Number.isFinite(cost) && cost >= 0 && this.balance >= cost;
  }

  spend(cost) {
    if (!this.canAfford(cost)) {
      return false;
    }

    this.balance -= cost;
    this.notify();
    return true;
  }

  subscribe(listener) {
    if (typeof listener !== 'function') {
      return () => {};
    }

    this.listeners.add(listener);
    listener(this.balance);

    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.balance));
  }
}
