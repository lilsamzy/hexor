let basket_id ='';
let smartCard ='';
$(document).ready(function () {
    $("#topup").submit(function(e) {

        e.preventDefault();

        disableBtn('topBtn');

        let form = $(this);
        let url = 'controller/auth.php';


        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            success: function(data)
            {
                enableBtn('topBtn');
               window.location.href = data;

            }
        });


    });

    $("#airtime").submit(function(e) {

        e.preventDefault();

        disableBtn('airtimeBtn');

        let form = $(this);
        let url = 'controller/auth.php';

        let seForm = form.serializeArray();

        let amount = "1";
        let phone = seForm[3].value;
        let email = seForm[4].value;



        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            success:  function (data) {


                let result = JSON.parse(data);

                if (result[0] === 'error') {

                    toastr.error(result[1], 'Failed');
                    enableBtn('airtimeBtn');
                } else if (result[0] === "success") {

                    toastr.success("Airtime Purchase Successful", "Success");

                    setTimeout(function () {
                        window.location.reload();
                    }, 3000);

                    enableBtn('airtimeBtn');

                } else {
                    try {
                        let result =  makePayment(amount, email, phone, 'Guest', 'Airtime Top Up');
                        console.log(result);
                    }
                    catch (e) {
                       console.log(e);
                    }
                }


            }
        });


    });

    $("#paytv").submit(function(e) {

        e.preventDefault();

        disableBtn('check_sc_num');

        let form = $(this);
        let url = 'controller/auth.php';

        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            success: function(data)
            {

                enableBtn('check_sc_num');

                let result = JSON.parse(data);

                if(result[0]==='error'){

                    toastr.error(result[1], 'Failed');
                    $('#accDetails').html(``);
                }
                else if(result[0]==="success"){
                    basket_id = result[1][0];
                    smartCard = result[9];
                    $('#init').remove();
                    $('.paycontainer').html(`
                     <div class="col-md-6">
                    <div class="boxed boxed--lg bg--white text-center feature" id="accountInfo">
                    <p class="text-center">Account Information</p>
                    <p><strong>Account Name:</strong> ${result[2][0]} &nbsp; ${result[3][0]} <br/>
                    <strong>Account Balance:</strong> ${result[6][0]} <br/>
                    <strong>Amount Due:</strong> ${result[4][0]} <br/>
                    <strong>Current Bouquet:</strong> ${result[7][0]} <br/>
                    <strong>Expiry:</strong> ${result[5]} <br/>
                    <strong>Bouquet Price:</strong> ${result[8][0]} </p>
                    
                      <div class="col-md-12">
                      <div class="input-select">
                    <select name="transType" onchange="payTvTransactionType(event)" class="transType" required>
                    <option selected="" value="">Select Transaction Type</option>
                     <option value="topUp">Top Up</option>
                    <option value="upgradeBouquet">Upgrade Bouquet</option>
                   </select>
                    </div>   
                     </div>        
                    </div>
                    </div>

                    `)



                }
                else{
                   // window.location.href = result[1];
                }


            }
        });


    });

    $("#paytv_guest").submit(function(e) {

        e.preventDefault();

        disableBtn('check_sc_num');

        let form = $(this);
        let url = 'controller/auth.php';

        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            success: function(data)
            {

                enableBtn('check_sc_num');

                let result = JSON.parse(data);

                result[0] = "success";

                if(result[0]==='error'){

                    toastr.error(result[1], 'Failed');
                    $('#accDetails').html(``);
                }
                else if(result[0]==="success"){
                    basket_id = result[1][0];
                    smartCard = result[9];
                    $('#init').remove();
                    $('.paycontainer').html(`
                     <div class="col-md-6">
                    <div class="boxed boxed--lg bg--white text-center feature" id="accountInfo">
                    <p class="text-center">Account Information</p>
                    <p><strong>Account Name:</strong> ${result[2][0]} &nbsp; ${result[3][0]} <br/>
                    <strong>Account Status:</strong> ${result[10][0]} <br/>
                    <strong>Account Balance:</strong> ${result[6][0]} <br/>
                    <strong>Amount Due:</strong> ${result[4][0]} <br/>
                    <strong>Current Bouquet:</strong> ${result[7][0]} <br/>
                    <strong>Expiry:</strong> ${result[5]} <br/>
                    <strong>Bouquet Price:</strong> ${result[8][0]} </p>
                      <div class="col-md-12">
                      <div class="input-select">
                    <select name="transType" onchange="payTvTransactionType2(event)" class="transType" required>
                    <option selected="" value="">Select Transaction Type</option>
                     <option value="topUp">Top Up</option>
                    <option value="upgradeBouquet">Upgrade Bouquet</option>
                   </select>
                    </div>   
                     </div>        
                    </div>
                    </div>

                    `)



                }
                else{
                    // window.location.href = result[1];
                }


            }
        });


    });

    $("#insurance").submit(function(e) {

        e.preventDefault();
        disableBtn('insuranceBtn');

        let form = $(this);
        let url = 'controller/auth.php';

        $.ajax({
            type: "POST",
            url: url,
            data: form.serialize(),
            success: function(data)
            {

                enableBtn('insuranceBtn');

                let result = JSON.parse(data);

                if(result[0]==='error'){
                    toastr.error(result[1], 'Failed');

                }
                else if(result[0]==="success"){
                    toastr.success('Purchase Successful.', 'Success');
                    $('#insurance').get(0).reset();

                }
                else{
                    window.location.href = result[1];
                }



            }
        });


    });

    $("#transfer").click(function () {

        if (confirm("Are you sure you want to transfer your commission to wallet?")) {
            let url = 'controller/auth.php';
            $.ajax({
                type: "GET",
                url: url,
                data: 'transfer_commission=true',
                success: function(data)
                {
                    toastr.success('Commission Transferred.', 'Success');

                    setTimeout(function (){
                        window.location.reload();
                    },3000);

                }
            });

        }

    });

    function enableBtn(id){

        $( "#"+id ).removeClass( "running" );
       document.getElementById(id).disabled = false;
    }

    function disableBtn(id){
        $( "#"+id  ).addClass( "running" );
       document.getElementById(id).disabled = true;
    }

    $radios = $('input[name=payTop]').change(function () {
        var value = $radios.filter(':checked').val();
       if(value=='bank'){
           $('#topUpAmount').html(`
              <h5>
                            You can manually top up using the account details <br>
                            Account No: <b>0515242501</b> <br/>
                            Account Name: <b>SERVPAY ENTERPRISE</b> <br/>
                            Bank: <b>GTB</b> <br/>
                            Kindly use your user ID and user name as the payment reference/narration
                        </h5>
           `)
       }
       else if(value=='atm'){
           $('#topUpAmount').html(`  <h5 style="padding-top: 15px;">Enter Top Up Amount (â‚¦)</h5>
                                    <input type="number" name="amount" id="top_amount" placeholder="" required /> 
                                       <button class="btn btn--primary type--uppercase ld-ext-right"
                                        id="topBtn" type="submit">Topup
                                        <div class="ld ld-ring ld-spin"></div>
                                        </button>
        `);
       }
    });

    $(document).on('change', '#bouquet', function(e) {
       let package_amount = "1";
       $('#package_amount').val(package_amount);
    });

    $(document).on('submit', '#topUpDstv', function(e) {
        e.preventDefault();
        // Do your form stuff

        $('').attr("data-amount");

        disableBtn('dstvBtn');
        let form = $(this);

        let url = 'controller/auth.php';

        let formDetails = form.serializeArray();

        let amount = "1";
        let phone = formDetails[2].value;
        let email = formDetails[1].value;

        // $.ajax({
        //     type: "POST",
        //     url: url,
        //     data: form.serialize(),
        //     success: function(data)
        //     {
        //
        //         enableBtn('dstvBtn');
        //
        //         console.log(data);
        //
        //         let result = JSON.parse(data);
        //
        //         if(result[0]==='error'){
        //
        //             toastr.error(result[1], 'Failed');
        //         }
        //         else if(result[0]==="success"){
        //
        //             toastr.success(result[1],"Success");
        //
        //             setTimeout(function (){
        //                 window.location.reload();
        //             },3000);
        //
        //         }
        //         else{
        //             window.location.href = result[1];
        //         }
        //
        //     }
        // });


        FlutterwaveCheckout({
            public_key: "FLWPUBK-84cc97d61f322bc6073b8fdf5fbecaab-X",
            tx_ref: makeid(6),
            amount: "1",
            currency: "NGN",
            country: "NG",
            payment_options: "card, banktransfer, ussd, qr, credit, barter, payattitude, paga",
            customer: {
                email: email,
                phone_number: phone,
                name: 'guest',
            },
            callback: function (data) {
                console.log(data);

                if(data.status === "successful"){
                    let form = $(this);
                    let url = 'controller/auth.php';

                    $.ajax({
                        type: "POST",
                        url: url,
                        data: form.serialize()+ '&trans_ref=' + data.flw_ref,
                        success: function(data)
                        {

                            enableBtn('dstvBtn');

                            console.log(data);

                            let result = JSON.parse(data);

                            if(result[0]==='error'){

                                toastr.error(result[1], 'Failed');
                            }
                            else if(result[0]==="success"){

                                toastr.success(result[1],"Success");

                                setTimeout(function (){
                                    window.location.reload();
                                },3000);

                            }
                            else{
                                window.location.href = result[1];
                            }

                        }
                    });
                }



            },
            onclose: function() {
                // close modal
            },
            customizations: {
                title: "ServPay",
                description: 'DSTV Top Up',
                logo: "https://servpay.ng/img/logo-light.png",
            },
        });





    });



});

function payTvTransactionType(event){
    var selectElement = event.target;
    var value = selectElement.value;

    if(value==='topUp'){

        $('#upgradeContainer').remove();

        $('#accountInfo').append(`
        
           <div class="col-md-12" id="topupContainer">
           <form name="topUpDstv" id="topUpDstv" >
           <br/>
          
            <input type="number" name="amount" required placeholder="Top Up Amount" />
            
            <input type="hidden" name="basket_num" value="${basket_id}" />
            <input type="hidden" name="smart_card_num" value="${smartCard}" />
            <input type="hidden" name="dstv_top_up" value="true" />
       
             <div class="col-md-12">
                <h5 class="text-center">Payment Mode</h5>
               </div>
               
            <div class="col-sm-6" style="display: inline-block; float: left">
                <div class="input-radio">
                    <span class="input__label">Wallet</span>
                    <input type="radio" name="payment" required value="wallet" id="wallet">
                    <label for="wallet"></label>
                </div>
             </div>
        <div class="col-sm-6" style="display: inline-block">
            <div class="input-radio">
                <span class="input__label">Card</span>
                <input id="card" type="radio" required name="payment" value="card">
                <label for="card"></label>
            </div>
        </div>
           <div class="col-md-12">
            <button type="submit" class="btn btn--primary ld-ext-right" id="dstvBtn">Submit
                <div class="ld ld-ring ld-spin"></div>
            </button>
            </div>
           </form>
           </div>
       
        `);
    }
    else if(value==='upgradeBouquet'){

        let url = 'controller/auth.php';
        let bouquet='';
        $.ajax({
            type: "GET",
            url: url,
            data: 'dstv_package=true',
            success: function(data)
            {
                bouquet = data;
                $('#bouquet').append(data);
            }
        });

        $('#topupContainer').remove();

        $('#accountInfo').append(`
                       
           <div class="col-md-12" id="upgradeContainer">
           <form name="topUpDstv" id="topUpDstv">
             <input type="hidden" name="basket_num" value="${basket_id}" />
             <input type="hidden" name="smart_card_num" value="${smartCard}" />
              <input type="hidden" name="dstv_upgrade" value="true" />
              <input type="hidden" name="package_amount" id="package_amount" value="" />
           <br/>
          
               <div class="col-md-12">
                <div class="input-select">
        <select name="package" required id="bouquet">
            <option selected="" value="">Select Package </option>
                   ${bouquet}
              </select>
                </div>
             </div>
       
             <div class="col-md-12">
                <h5 class="text-center">Payment Mode</h5>
               </div>
               
            <div class="col-sm-6" style="display: inline-block; float: left">
                <div class="input-radio">
                    <span class="input__label">Wallet</span>
                    <input type="radio" name="payment" required value="wallet" id="wallet">
                    <label for="wallet"></label>
                </div>
             </div>
        <div class="col-sm-6" style="display: inline-block">
            <div class="input-radio">
                <span class="input__label">Card</span>
                <input id="card" type="radio" required name="payment" value="card">
                <label for="card"></label>
            </div>
        </div>
           <div class="col-md-12">
            <button type="submit" class="btn btn--primary ld-ext-right" id="dstvBtn">Submit
                <div class="ld ld-ring ld-spin"></div>
            </button>
            </div>
           </form>
           </div>
       
        `);
    }

}




function payTvTransactionType2(event){
    var selectElement = event.target;
    var value = selectElement.value;

    if(value==='topUp'){

        $('#upgradeContainer').remove();

        $('#accountInfo').append(`
        
           <div class="col-md-12" id="topupContainer">
           <form name="topUpDstv" id="topUpDstv" >
           <br/>
          
            <input type="number" name="amount" required placeholder="Top Up Amount *" />
             <br/><br/>
            <input type="email" name="cust_email" required  placeholder="Your email *" />
            <br/><br/>
            <input type="tel" name="cust_phone" required  placeholder="Your Phone *" />
         
            
            <input type="hidden" name="basket_num" value="${basket_id}" />
            <input type="hidden" name="smart_card_num" value="${smartCard}" />
            <input type="hidden" name="dstv_top_up" value="true" />
       
            <br/><br/>
           <div class="col-md-12">
            <button type="submit" class="btn btn--primary ld-ext-right" id="dstvBtn">Submit
                <div class="ld ld-ring ld-spin"></div>
            </button>
            </div>
           </form>
           </div>
       
        `);
    }
    else if(value==='upgradeBouquet'){

        let url = 'controller/auth.php';
        let bouquet='';
        $.ajax({
            type: "GET",
            url: url,
            data: 'dstv_package=true',
            success: function(data)
            {
                bouquet = data;
                $('#bouquet').append(data);
            }
        });

        $('#topupContainer').remove();

        $('#accountInfo').append(`
                       
           <div class="col-md-12" id="upgradeContainer">
           <form name="topUpDstv" id="topUpDstv">
             <input type="hidden" name="basket_num" value="${basket_id}" />
             <input type="hidden" name="smart_card_num" value="${smartCard}" />
             <input type="hidden" name="dstv_upgrade" value="true" />
             <input type="hidden" name="package_amount" id="package_amount" value="" />
           <br/>
          
               <div class="col-md-12">
                <div class="input-select">
        <select name="package" required id="bouquet">
            <option selected="" value="">Select Package </option>
                   ${bouquet}
              </select>
                </div>
             </div>
                 <div class="col-md-12">
                   <input type="email" name="cust_email"  placeholder="Your email" />
                </div>
       
            <br/><br/>
           <div class="col-md-12">
            <button type="submit" class="btn btn--primary ld-ext-right" id="dstvBtn">Submit
                <div class="ld ld-ring ld-spin"></div>
            </button>
            </div>
           </form>
           </div>
       
        `);
    }

}

