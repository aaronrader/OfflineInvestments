class Ledger {
    constructor(trades) {
        this.trades = trades.map((trade) => new Trade(trade));
    }

    post(trade) {
        this.trades.push(new Trade(trade));
        this.trades.sort((a, b) => a.dateTime - b.dateTime);
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

        this.ledger.trades.forEach((trade) => {
            let existingHolding = holdings.find((holding) => holding.security === trade.security);
            if (existingHolding) {
                existingHolding.processTransaction(trade);
            }
            else {
                holdings.push(new Holding(trade.security, trade.quantity, trade.total));
            }
        })
        return holdings;
    }
}

class Holding {
    constructor(security, quantity, startingPrice) {
        this.security = security;
        this.quantity = quantity;
        this.bookCost = startingPrice;
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

class Security {
    constructor(security) {
        this.ticket = security.ticket;
        this.longName = security.longName;
        this.type = security.type;
        this.marketValue = security.marketValue;
    }

    equals(security) {
        return this.ticket === security.ticket;
    }
}

export { Account, Holding, Ledger, Trade, Security }