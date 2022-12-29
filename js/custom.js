let orderinprocess;
let ordercompleted;
// render data in tables
$(document).ready(function () {
    updateOrderProcessTable()
    updateOrderCompleteTable()
})
// get orderinprocess data from local storage
if (localStorage.getItem("orderinprocess")) {
    orderinprocess = JSON.parse(localStorage.getItem("orderinprocess"))
}
else {
    orderinprocess = []
}
// get ordercompleted data from local storage
if (localStorage.getItem("ordercompleted")) {
    ordercompleted = JSON.parse(localStorage.getItem("ordercompleted"))
}
else {
    ordercompleted = []
}
// update data in order process table
function updateOrderProcessTable() {
    if (localStorage.getItem("orderinprocess")) {
        orderinprocess = JSON.parse(localStorage.getItem("orderinprocess"))
    }
    else {
        orderinprocess = []
    }

    let tempData = "";
    orderinprocess.map((orderinprocessItem, ind) => {
        tempData += `<tr>
        <td><h6>${ind + 1}</h6></td>
        <td><h6>${orderinprocessItem.name}</h6></td>
        <td><h6>${orderinprocessItem.orderItem.split("-")[1]}</h6></td>
        <td><h6>${orderinprocessItem.tableNo}</h6></td>
        <td><h6>${orderinprocessItem.amount}</h6></td>
        <td class="progress-cell">
            <div class="progress progress-default">
                <div class="progress-bar" data-duration="${orderinprocessItem.duration}" role="progressbar" style="width: 0%" aria-valuemax="100"></div>
            </div>
        </td>
    </tr>`
        $("#order-in-process-body").html(tempData)
        $(".progress-bar").each((ind, elem) => {
            let progressval = 0;
            console.log($(elem).data("duration"))
            setInterval(() => {
                if (progressval < 100) {
                    progressval += 1;
                    $(elem).css("width", `${progressval}%`)
                }
            }, $(elem).data("duration") * 10);
            setTimeout(() => {
                deQueue(orderinprocess, orderinprocessItem)
                enQueue(ordercompleted, orderinprocessItem)
                console.log(ordercompleted)
                console.log(orderinprocess)
                localStorage.setItem("orderinprocess", JSON.stringify(orderinprocess))
                localStorage.setItem("ordercompleted", JSON.stringify(ordercompleted))
                updateOrderProcessTable()
                updateOrderCompleteTable()
            }, $(elem).data("duration") * 1000);
        })
    })
}
// update data in order completed table
function updateOrderCompleteTable() {
    if (localStorage.getItem("ordercompleted")) {
        ordercompleted = JSON.parse(localStorage.getItem("ordercompleted"))
    }
    else {
        ordercompleted = []
    }
    let tempData = "";
    ordercompleted.map((ordercompletedItem, ind) => {
        tempData += `<tr>
        <td><h6>${ind + 1}</h6></td>
        <td><h6>${ordercompletedItem.name}</h6></td>
        <td><h6>${ordercompletedItem.orderItem.split("-")[1]}</h6></td>
        <td><h6>${ordercompletedItem.tableNo}</h6></td>
        <td><h6>${ordercompletedItem.amount}</h6></td>
        <td><h6>Completed</h6></td>
        </tr>`
    })
    $("#order-completed-body").html(tempData)
}
// enqeue method
function enQueue(queue, item) {
    queue.push(item)
}
// deqeue method
function deQueue(queue, item) {
    ind = queue.indexOf(item)
    queue.splice(ind, 1)
}
// order place
$("#order-form").on('submit', function (e) {
    e.preventDefault()
    let tempData = {
        name: $("input[name='name']").val(),
        amount: $("input[name='amount']").val(),
        duration: $("input[name='duration']").val(),
        tableNo: $("select[name='tableNo']").val(),
        email: $("select[name='email']").val(),
        orderItem: $("select[name='orderItem']").val(),
        message: $("select[name='message']").val(),
        completed: 0,
    }
    let ind = $("#order-in-process-body tr").length
    $("#order-in-process-body").append(`<tr>
    <td><h6>${ind}</h6></td>
        <td><h6>${tempData.name}</h6></td>
        <td><h6>${tempData.orderItem.split("-")[1]}</h6></td>
        <td><h6>${tempData.tableNo}</h6></td>
        <td><h6>${tempData.amount}</h6></td>
        <td class="progress-cell">
            <div class="progress progress-default">
                <div class="progress-bar" data-duration="${tempData.duration}" role="progressbar" style="width: 0%" aria-valuemax="100"></div>
            </div>
        </td>
    </tr>`)
    $("input").val("")
    enQueue(orderinprocess, tempData)
    localStorage.setItem("orderinprocess", JSON.stringify(orderinprocess))
    createToast("order has been placed!")
})
// toast function
function createToast(message) {
    let toast = document.createElement("div")
    $(toast).append(`<div class="toast align-items-center show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body">
                <p>${message}</p>
            </div>
            <button type="button" class="ms-auto" data-bs-dismiss="toast" aria-label="Close"><i
                class="fa-solid fa-xmark"></i></button>
        </div>
    </div>`)
    $(".toast-container").append(toast)
    setTimeout(() => {
        $(toast).remove()
    }, 5000);
}
// clear data from localstorage and table
$(".clear-data").click(function () {
    if ($(this).data('target') == 'process') {
        localStorage.removeItem("orderinprocess");
        setTimeout(() => {
            updateOrderProcessTable()
        }, 300);
    }
    else if ($(this).data('target') == 'completed') {
        localStorage.removeItem("ordercompleted");
        setTimeout(() => {
            updateOrderCompleteTable()
        }, 300);
    }
})
$("select[name='orderItem']").change(function () {
    let tempId = $(this).val().split("-")[0]
    Items.map((cateItem) => {
        cateItem.items.map((prodItem) => {
            if (tempId == prodItem.id) {
                $("input[name='duration']").val(prodItem.durationInSec)
            }
        })
    })
})