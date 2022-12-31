
let orderinprocess;
let ordercompleted;
// render data in tables
$(document).ready(function () {
    updateOrderProcessTable()
    updateOrderCompleteTable()
    setActiveItem()
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
    $("#order-in-process-body").html("")
    orderinprocess.map((orderinprocessItem, ind) => {
        tempData += `<tr data-id="${orderinprocessItem.id}">
            <td><h6>${ind + 1}</h6></td>
            <td><h6>${orderinprocessItem.name}</h6></td>
            <td><h6>${orderinprocessItem.orderItem.split("-")[1]}</h6></td>
            <td><h6>${orderinprocessItem.tableNo}</h6></td>
            <td><h6>${orderinprocessItem.amount}</h6></td>
            <td class="progress-cell">
            <h6>Due</h6>
                <div class="progress progress-default">
                    <div class="progress-bar" data-duration="${orderinprocessItem.duration}" role="progressbar" style="width: 0%" aria-valuemax="100"></div>
                </div>
            </td>
        </tr>`
        $("#order-in-process-body").html(tempData)
    })
    setActiveItem()
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
        tempData += `<tr data-id="${ordercompleted.id}">
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
        id: Date.now(),
        name: $("input[name='name']").val(),
        amount: $("input[name='amount']").val(),
        duration: $("input[name='duration']").val(),
        tableNo: $("select[name='tableNo']").val(),
        email: $("select[name='email']").val(),
        orderItem: $("select[name='orderItem']").val(),
        message: $("select[name='message']").val(),
        completed: 0,
    }
    if($("#order-in-process-body").text().includes($("select[name='tableNo']").val())){
        createToast(`${$("select[name='tableNo']").val()} is already occupied`,"danger")
    }    
    else{
        let ind = ($("#order-in-process-body tr").length + 1)
        $("#order-in-process-body").append(`<tr  data-id="${tempData.id}">
        <td><h6>${ind}</h6></td>
            <td><h6>${tempData.name}</h6></td>
            <td><h6>${tempData.orderItem.split("-")[1]}</h6></td>
            <td><h6>${tempData.tableNo}</h6></td>
            <td><h6>${tempData.amount}</h6></td>
            <td class="progress-cell">
            <h6>Due</h6>
                <div class="progress progress-default">
                    <div class="progress-bar" data-duration="${tempData.duration}" role="progressbar" style="width: 0%" aria-valuemax="100"></div>
                </div>
            </td>
        </tr>`)
        $("input,textarea").val("")
        enQueue(orderinprocess, tempData)
        localStorage.setItem("orderinprocess", JSON.stringify(orderinprocess))
        setActiveItem()
        createToast("order has been placed!")
    }
})
// toast function
function createToast(message,type="success") {
    let toast = document.createElement("div")
    $(toast).append(`<div class="toast align-items-center bg-${type} border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body">
        <p>${message}</p>
      </div>
      <button type="button" class="ms-auto" data-bs-dismiss="toast" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
    </div>
  </div>`)
    $(".toast-container").append(toast)
    setTimeout(() => {
        $(toast).remove()
    }, 5000);
}
// clear data from localstorage and table
$(".clear-data").click(function () {
    if(confirm("Are you Sure? All records will be deleted!")){
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
    }
})
$("select[name='orderItem']").change(function () {
    let tempId = $(this).val().split("-")[0]
    Items.map((cateItem) => {
        cateItem.items.map((prodItem) => {
            if (tempId == prodItem.id) {
                $("input[name='duration']").val(prodItem.durationInSec)
                $("input[name='amount']").attr("min",prodItem.price)
                $("input[name='amount']")[0].oninvalid = function(e) {
                    e.target.setCustomValidity("");
                    if (!e.target.validity.valid) {
                        e.target.setCustomValidity(`Selected Item price is ${prodItem.price}`);
                    }
                };
                $("input[name='amount']")[0].onvalid = function(e){
                    e.target.setCustomValidity("")
                }
            }
        })
    })
})

function setActiveItem() {
    let activeOrder;
    let progressval = 0;
    let activeItem = $("#order-in-process-body tr").first();
    let activeOrderId = $(activeItem).first().data('id')
    orderinprocess.map((curOrder)=>{
        if(curOrder.id == activeOrderId){
            activeOrder = curOrder;
        }
    })
    if (activeItem.length > 0 && !$(activeItem).hasClass("active")) {
        $(activeItem).addClass("active")
        $(activeItem).find(".progress-cell").children("h6").html("Processing")
        let progessInterval =  setInterval(() => {
            if (progressval < 100) {
                progressval += 1;
                $(activeItem).find(".progress-bar").css("width", `${progressval}%`)
            }
        }, activeOrder.duration * 10);
        setTimeout(() => {
            clearInterval(progessInterval)
            deQueue(orderinprocess, activeOrder)
            enQueue(ordercompleted, activeOrder)
            localStorage.setItem("orderinprocess", JSON.stringify(orderinprocess))
            localStorage.setItem("ordercompleted", JSON.stringify(ordercompleted))
            updateOrderProcessTable()
            updateOrderCompleteTable()
            setActiveItem()
        }, activeOrder.duration * 1000);
    }
}