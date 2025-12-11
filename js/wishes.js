const WishManager = {
  domain: "https://admin.hieuvananh.com/",

  /**
   * Fetch wishes from the API
   * @param {number} type - 1 for Wedding, 2 for Baby
   * @param {function} onSuccess - Callback with response data
   * @param {function} onError - Callback on failure
   */
  fetchWishes: function (type, onSuccess, onError) {
    $.ajax({
      url: this.domain + "api/get-wish?wish_type=" + type,
      type: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      success: function (response) {
        if (typeof onSuccess === "function") onSuccess(response);
      },
      error: function (xhr) {
        if (typeof onError === "function") onError(xhr);
        else
          toastr.error("Không thể tải danh sách lời chúc, vui lòng thử lại!");
      },
    });
  },

  /**
   * Send a new wish
   * @param {string} name - Name of the sender
   * @param {string} message - content of the wish
   * @param {number} type - 1 for Wedding, 2 for Baby
   * @param {function} onSuccess - Callback on success
   * @param {function} onError - Callback on failure
   */
  sendWish: function (name, message, type, onSuccess, onError, onComplete) {
    if (!name || !message) {
      toastr.error("Vui lòng điền đầy đủ thông tin!");
      if (typeof onComplete === "function") onComplete();
      return;
    }

    $.ajax({
      url: this.domain + "api/wish",
      type: "POST",
      headers: {
        Accept: "application/json",
      },
      data: {
        name: name,
        wish_message: message,
        wish_type: type,
      },
      success: function (response) {
        toastr.success("Lời chúc của bạn đã được gửi thành công!");
        if (typeof onSuccess === "function") onSuccess(response);
      },
      error: function (xhr) {
        if (typeof onError === "function") {
          onError(xhr);
        } else {
          if (xhr.status === 422) {
            var errors = xhr.responseJSON.errors;
            Object.values(errors).forEach(function (errorMessages) {
              errorMessages.forEach(function (msg) {
                toastr.error(msg);
              });
            });
          } else if (xhr.responseJSON && xhr.responseJSON.error) {
            toastr.error(xhr.responseJSON.error);
          } else {
            toastr.error("Đã xảy ra lỗi, vui lòng thử lại!");
          }
        }
      },
      complete: function () {
        if (typeof onComplete === "function") onComplete();
      },
    });
  },
};
