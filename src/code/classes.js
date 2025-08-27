class Ledger {
    constructor(trades) {
        this.trades = trades.map((trade) => new Trade(trade));
    }

    post(trade) {
        this.trades.push(new Trade(trade));
        this.trades.sort((a, b) => b.dateTime - a.dateTime);
    }

    delete(tradeId) {
        this.trades = this.trades.filter((val) => val.id !== tradeId)
    }
}

class Trade {
    constructor(trade) {
        this.id = trade.id;
        this.dateTime = new Date(trade.dateTime);
        this.type = trade.type;
        this.security = trade.security;
        this.quantity = trade.quantity;
        this.price = trade.price;
        this.fees = trade.fees;
    }

    get total() {
        return this.price * this.quantity + this.fees;
    }
}

class Account {
    constructor(data) {
        this.name = data.name;
        this.ledger = new Ledger(data.ledger.trades);
    }

    get holdings() {
        let holdings = [];
        if (!this.ledger) return holdings;

        this.ledger.trades.toSorted((a, b) => a.dateTime - b.dateTime).forEach((trade) => {
            let existingHolding = holdings.find((holding) => holding.security === trade.security);
            if (existingHolding) {
                existingHolding.processTransaction(trade);
            }
            else {
                holdings.push(new Holding(trade));
            }
        })
        return holdings.toSorted((a, b) => a.security.localeCompare(b.security));
    }
}

class Holding {
    constructor(firstTrade) {
        this.security = firstTrade.security;
        if (firstTrade.type === "BUY") {
            this.quantity = firstTrade.quantity;
            this.bookCost = firstTrade.total;
        } else {
            this.quantity = -firstTrade.quantity;
            this.bookCost = 0;
        }
    }

    get avgPrice() {
        return this.bookCost / this.quantity;
    }

    get marketCost() {
        return this.quantity * this.security.marketValue;
    }

    processTransaction(trade) {
        if (trade.type === "BUY") {
            this.bookCost += trade.total;
            this.quantity += trade.quantity;
        }
        else {
            this.bookCost -= (trade.quantity * this.avgPrice);
            this.quantity -= trade.quantity;
        }
    }
}

export { Account, Holding, Ledger, Trade }