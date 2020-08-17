export default class RequestsManager {
  constructor(url) {
    this.url = url;
  }

  setPassword(password) {
    this.password = password;
  }

  createTicket(coin) {
    return this.sendRequest(`/new/${coin}`, {}, "GET");
  }

  fetchTicketInfos(id, spender) {
    return this.sendRequest(`/ticket/${id}/infos`, { spender: spender }, "GET");
  }

  setAmount(id, spender, amount) {
    return this.sendRequest(
      `/ticket/${id}/setamount`,
      { spender: spender, amount: amount },
      "POST"
    );
  }

  setLeftover(id, spender, address) {
    return this.sendRequest(
      `/ticket/${id}/setleftover`,
      { spender: spender, address: address },
      "POST"
    );
  }

  setReceiver(id, spender, address) {
    return this.sendRequest(
      `/ticket/${id}/setreceiver`,
      { spender: spender, address: address },
      "POST"
    );
  }

  askPayment(id, spender) {
    return this.sendRequest(
      `/ticket/${id}/askpayment`,
      { spender: spender },
      "POST"
    );
  }

  getBalance(id, spender) {
    return this.sendRequest(
      `/ticket/${id}/balance`,
      { spender: spender },
      "GET"
    );
  }

  confirmReception(id, spender, fast) {
    return this.sendRequest(
      `/ticket/${id}/balance`,
      { spender: spender, fast: fast },
      "GET"
    );
  }

  sendRequest(route, parameters, method) {
    let formBody = [];
    for (const property in parameters) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(parameters[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    switch (method) {
      case "GET":
        return fetch(`${this.url}${route}?${formBody}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            Authorization: this.password,
          },
        });

      case "POST":
        return fetch(this.url + route, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            Authorization: this.password,
          },
          body: formBody,
        });
    }
  }
}
