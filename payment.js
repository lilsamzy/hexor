/*
    =============================
    Funding wallet
    =============================
 */
function payWithMonnify(ref_id) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../get-tracks',
        type: 'POST',
        datatype: 'json',
        data: {ref_id:ref_id},
        success:function(response){
            resp = $.parseJSON(response)
            let amount = parseInt(resp.amount)
            let fee = parseInt(resp.charges)
            let amountentered = parseInt(resp.amountEntered)
            let action = resp.action
            MonnifySDK.initialize({
                amount: parseInt(amount),
                currency: "NGN",
                reference: ref_id,
                customerName: resp.name,
                customerEmail: resp.email,
                customerMobileNumber: resp.phone,
                apiKey: resp.monnify_api_key,
                contractCode: resp.monnify_contract_code,
                paymentDescription: resp.name +'Fund\'s account',
                paymentMethods: ["CARD"],
                onComplete: function(response){
                    if (response.responseCode !== "USER_CANCELLED") {
                        let amountPaid = response.amountPaid
                        let paidOn = response.paidOn
                        let paymentReference = response.paymentReference
                        let status = response.status
                        let paymentStatus = response.paymentStatus
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: '../processPayment',
                            type: 'POST',
                            dataType: "json",
                            data: {actionPerformed:action,fee:fee,amount:amountPaid,amountentered:amountentered,paymentDate:paidOn,paymentReference:paymentReference,status:status,paymentStatus:paymentStatus,gateway:'monnify',ref_id:ref_id},
                            success:function(result){
                                console.log(result)
                                // let response = JSON.parse(result);
                                var ref_id = result.ref_id
                                if(result.status){
                                    window.location.href='../depositsuccessful/'+ref_id
                                }else{
                                    //window.location.href='./fund';
                                    window.location.href='../depositsuccessful/'+ref_id
                                }
                            }
                        })
                        //Implement what happens when transaction is completed.
                        // console.log(response);
                    }
                },
                onClose: function(data){
                    //Implement what should happen when the modal is closed here
                    //console.log(data);
                    //perform on cancel request log.
                },

            });
        }
    });
}

function payWithMonnifyTransfer(ref_id) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../get-tracks',
        type: 'POST',
        datatype: 'json',
        data: {ref_id:ref_id},
        success:function(response){
            resp = $.parseJSON(response)
            let amount = parseInt(resp.amount)
            let fee = parseInt(resp.charges)
            let amountentered = parseInt(resp.amountEntered)
            let action = resp.action
            if(amount > 50000){
                amount = amount + 500;
            }
            MonnifySDK.initialize({
                amount: parseInt(amount),
                currency: "NGN",
                reference: ref_id,
                customerName: resp.name,
                customerEmail: resp.email,
                customerMobileNumber: resp.phone,
                apiKey: resp.monnify_api_key,
                contractCode: resp.monnify_contract_code,
                paymentDescription: resp.name +'Fund\'s account',
                paymentMethods: ["ACCOUNT_TRANSFER"],
                onComplete: function(response){
                    if (response.responseCode !== "USER_CANCELLED") {
                        let amountPaid = response.amountPaid
                        let paidOn = response.paidOn
                        let paymentReference = response.paymentReference
                        let status = response.status
                        let paymentStatus = response.paymentStatus
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: '../processPayment',
                            type: 'POST',
                            dataType: "json",
                            data: {actionPerformed:action,fee:fee,amount:amountPaid,amountentered:amountentered,paymentDate:paidOn,paymentReference:paymentReference,status:status,paymentStatus:paymentStatus,gateway:'monnify',ref_id:ref_id},
                            success:function(result){
                                console.log(result)
                                // let response = JSON.parse(result);
                                var ref_id = result.ref_id
                                if(result.status){
                                    window.location.href='../depositsuccessful/'+ref_id
                                }else{
                                    //window.location.href='./fund';
                                    window.location.href='../depositsuccessful/'+ref_id
                                }
                            }
                        })
                        //Implement what happens when transaction is completed.
                        // console.log(response);
                    }
                },
                onClose: function(data){
                    //Implement what should happen when the modal is closed here
                    //console.log(data);
                    //perform on cancel request log.
                },

            });
        }
    });
}

function makePayment() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: './get-tracks',
        type: 'POST',
        datatype: 'json',
        success: function (response) {
            resp = $.parseJSON(response)
            let amount = parseInt(resp.amount)
            let fee = parseInt(resp.charges)
            let fluttercharge =  (1.4/100) * resp.amount
            let amountentered = parseInt(resp.amountEntered)
            let action = resp.action
            let tx_ref = resp.trx_id
            FlutterwaveCheckout({
                public_key: "FLWPUBK_TEST-e4f90780837e22daaf28c21c0ea3fc66-X",
                tx_ref: tx_ref,
                amount: amount + fluttercharge,
                currency: "NGN",
                country: "NG",
                payment_options: "card,mobilemoney,ussd",
                customer: {
                    email: resp.email,
                    phone_number: resp.phone,
                    name: resp.name,
                },
                callback: function (data) { // specified callback function
                    console.log(data);
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
                    $.ajax({
                        url: './processFundFlutter',
                        type: 'POST',
                        dataType: "json",
                        data: {actionPerformed:action,fee:fee,amount:data.amount,amountentered:amountentered,status:data.status,flutter_ref:data.transaction_id,gateway:'flutter'},
                        success:function(result){
                            // let response = JSON.parse(result);
                            var ref_id = result.ref_id
                            if(result.status){
                                window.location.href='./depositsuccessful/'+ref_id
                            }else{
                                //window.location.href='./fund';
                                window.location.href='./depositsuccessful/'+ref_id
                            }
                        }
                    })
                },
                customizations: {
                    title: "Recharge Pro",
                    description: "Wallet funding",
                    logo: "https://assets.piedpiper.com/logo.png",
                },
            });
        }
    });
}
/*
     ==========================
     Electric Bill Payments
     ==========================
 */
function payElectricWithFlutterwave(){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: './get-tracks',
        type: 'POST',
        datatype: 'json',
        success: function (response) {
            resp = $.parseJSON(response)
            let amount = parseInt(resp.amount)
            let fee = parseInt(resp.charges)
            let amountentered = parseInt(resp.amountEntered)
            let fluttercharge =  (1.4/100) * resp.amount
            let action = resp.action
            let tx_ref = resp.trx_id
            FlutterwaveCheckout({
                public_key: "FLWPUBK_TEST-e4f90780837e22daaf28c21c0ea3fc66-X",
                tx_ref: tx_ref,
                amount: amount + fluttercharge,
                currency: "NGN",
                country: "NG",
                payment_options: "card,mobilemoney,ussd",
                customer: {
                    email: resp.email,
                    phone_number: resp.phone,
                    name: resp.name,
                },
                callback: function (data) { // specified callback function
                    // console.log(data);
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
                    $.ajax({
                        url: './payElectricBillWithFluttter',
                        type: 'POST',
                        dataType: "json",
                        data: {actionPerformed:action,fee:fee,amount:data.amount,amountentered:amountentered,status:data.status,flutter_ref:data.transaction_id,gateway:'flutter'},
                        success:function(result) {
                            console.log(result)
                            if (result.status === 'pending') {
                                window.location.href = './response-electricity?icon=pending&msg=' + result.message;
                            }else if(result.status == 'error'){
                                window.location.href = './response-electricity?icon=error&msg=' + result.message;
                            }else if(result.status == 'success'){
                                window.location.href = './response-electricity?icon=success&msg=' + result.message;
                            }
                        }
                    })
                },
                customizations: {
                    title: "Recharge Pro",
                    description: "Purchase electricity.",
                    logo: "https://assets.piedpiper.com/logo.png",
                },
            });

        }
    });

}

function payElectricWithMonnify(){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: './get-tracks',
        type: 'POST',
        datatype: 'json',
        success: function (response) {
            resp = $.parseJSON(response)
            let amount = parseInt(resp.amount)
            let fee = parseInt(resp.charges)
            let amountentered = parseInt(resp.amountEntered)
            let action = resp.action

            MonnifySDK.initialize({
                amount: parseInt(amount),
                currency: "NGN",
                reference: '' + Math.floor((Math.random() * 1000000000) + 1),
                customerName: resp.name,
                customerEmail: resp.email,
                customerMobileNumber: resp.phone,
                apiKey: "MK_TEST_BUKKRPS2KE",
                contractCode: "2175259191",
                paymentDescription: "Test Pay",
                paymentMethods: ["CARD"],
                onComplete: function(response){
                    if (response.responseCode !== "USER_CANCELLED") {
                        let amountPaid = response.amountPaid
                        let paidOn = response.paidOn
                        let paymentReference = response.paymentReference
                        let status = response.status
                        let paymentStatus = response.paymentStatus
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: './payElectricityBillWithMonnify',
                            type: 'POST',
                            dataType: "json",
                            data: {actionPerformed:action,fee:fee,amount:amountPaid,amountentered:amountentered,paymentDate:paidOn,paymentReference:paymentReference,status:status,paymentStatus:paymentStatus,gateway:'monnify'},
                            success:function(result){
                                console.log(result)
                                if (result.status === 'pending') {
                                    window.location.href = './response-electricity?icon=pending&msg=' + result.message;
                                }else if(result.status == 'error'){
                                    window.location.href = './response-electricity?icon=error&msg=' + result.message;
                                }else if(result.status == 'success'){
                                    window.location.href = './response-electricity?icon=success&msg=' + result.message;
                                }else if(result.status == 'cancelled'){
                                    $('#exampleModalCenter').modal('hide');
                                }
                            }
                        })
                        //Implement what happens when transaction is completed.
                        // console.log(response);
                    }
                },
                onClose: function(data){
                    //Implement what should happen when the modal is closed here
                    console.log(data);
                    //perform on cancel request log.
                },

            });

        }
    });
}
/*
   ============================================================
    Airtime Payment
   ============================================================
*/

function BuyAirtimeWithMonnify(ref_id) {
    let pin_code = document.getElementById('pin_code').value;
    if(pin_code === ""){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Enter Transaction Code to autorize transaction",
        })
        return false;
    }
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../airtimeRechargeDetails',
        type: 'POST',
        datatype: 'json',
        data:{paymentGateway:'monnify', pin_code:pin_code, ref_id:ref_id},
        success: function (response){
            response = JSON.parse(response);
            console.log(response);
            let phone = response.phone_number;
            let amount = response.amount;
            let email = response.email;
            let customerName = response.customerName;
            let finalAmount = response.finalAmount;
            let monnify_api_key = response.monnify_api_key;
            let monnify_contract_code = response.monnify_contract_code;
            let product_id = response.product_id;
            let msisdn = response.msisdn;
            let pin = response.pin;
            if(pin == false){
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "invalid Transaction Code Enter your 4 digit Transaction Code",
                })
                return false;
            }
            MonnifySDK.initialize({
                amount: parseInt(finalAmount),
                currency: "NGN",
                reference: ref_id,
                customerName: customerName,
                customerEmail: email,
                customerMobileNumber: phone,
                apiKey: monnify_api_key,
                contractCode: monnify_contract_code,
                paymentDescription: "PAYMENT FOR AIRTEL TOP UP "+amount,
                paymentMethods: ["CARD"],
                onComplete: function(response){
                    if (response.responseCode !== "USER_CANCELLED") {
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: '../../prime_recharge',
                            type: 'POST',
                            dataType: "json",
                            data: {product_id:product_id,denomination:amount,send_sms:true,sms_text:'',customer_reference:ref_id,number:msisdn,paymentReference:response.paymentReference,gateway:'monnify', ref_id:ref_id},
                            success:function(result){
                                console.log(result)
                                if(result.status ==  201 || result.status == 208){
                                    // window.location.href='/recharge_successful?operator='+result.operator_name
                                    // window.location.href='/user/recharge_successful'
                                    window.location.href='/user/airtime/success/'+result.ref_id

                                    // console.log("successful");
                                }else{
                                    // window.location.href='/user/recharge_successful'
                                    Swal.fire({
                                        icon: "error",
                                        title: "Oops...",
                                        text: "Service Currently not available try again later",
                                    });
                                }
                            }
                        })
                    }

                    //Implement what happens when transaction is completed.
                    // console.log(response);
                },
                onClose: function(data){
                    //Implement what should happen when the modal is closed here
                    // console.log(data);
                }
            });
        }, 
        error: function (response){
            if(response.status === 422){
                console.log(response)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "invalid Transaction Code Enter your 4 digit Transaction Code",
                })
                return false;
            }
        },
    });
}

function BuyAirtimeWithMonnifyTransfer(ref_id) {
    let pin_code = document.getElementById('pin_code').value;
    if(pin_code === ""){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Enter Transaction Code to autorize transaction",
        })
        return false;
    }
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../airtimeRechargeDetails',
        type: 'POST',
        datatype: 'json',
        data:{paymentGateway:'monnify', pin_code:pin_code, ref_id:ref_id},
        success: function (response){
            response = JSON.parse(response);
            console.log(response);
            let finalAmount = response.finalAmount;
            let phone = response.phone_number;
            let amount = response.amount;
            if(amount > 50000){
                finalAmount = finalAmount + 500;
            }
            let email = response.email;
            let customerName = response.customerName;
            let monnify_api_key = response.monnify_api_key;
            let monnify_contract_code = response.monnify_contract_code;
            let product_id = response.product_id;
            let msisdn = response.msisdn;
            let pin = response.pin;
            if(pin == false){
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "invalid Transaction Code Enter your 4 digit Transaction Code",
                })
                return false;
            }
            MonnifySDK.initialize({
                amount: finalAmount,
                currency: "NGN",
                reference: ref_id,
                customerName: customerName,
                customerEmail: email,
                customerMobileNumber: phone,
                apiKey: monnify_api_key,
                contractCode: monnify_contract_code,
                paymentDescription: "PAYMENT FOR AIRTIME TOP UP "+amount,
                paymentMethods: ["ACCOUNT_TRANSFER"],
                onComplete: function(response){
                    if (response.responseCode !== "USER_CANCELLED") {
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: '../../prime_recharge',
                            type: 'POST',
                            dataType: "json",
                            data: {product_id:product_id,denomination:amount,send_sms:true,sms_text:'',customer_reference:ref_id,number:msisdn,paymentReference:response.paymentReference,gateway:'monnify',ref_id:ref_id},
                            success:function(result){
                                console.log(result)
                                if(result.status ==  201 || result.status == 208){
                                    // window.location.href='/recharge_successful?operator='+result.operator_name
                                    // window.location.href='/user/recharge_successful'
                                    window.location.href='/user/airtime/success/'+result.ref_id

                                    // console.log("successful");
                                }else{
                                    // window.location.href='/user/recharge_successful'
                                    Swal.fire({
                                        icon: "error",
                                        title: "Oops...",
                                        text: "Service Currently not available try again later",
                                    });
                                }
                            }
                        })
                    }

                    //Implement what happens when transaction is completed.
                    // console.log(response);
                },
                onClose: function(data){
                    //Implement what should happen when the modal is closed here
                    // console.log(data);
                }
            });
        },
        error: function (response){
            if(response.status === 422){
                console.log(response)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "invalid Transaction Code Enter your 4 digit Transaction Code",
                })
                return false;
            }
        },
    });
}

function BuyAirtimeWithFlutter() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../airtimeRechargeDetails',
        type: 'POST',
        datatype: 'json',
        data:{paymentGateway:'flutter'},
        success: function (response){
            response = JSON.parse(response);
            console.log(response);
            let phone = response.phone_number;
            let amount = parseInt(response.totalAmount);
            let email = response.email;
            let fluttercharge =  (1.4/100) * amount
            let customerName = response.customerName;
            let finalAmount = Math.ceil(response.finalAmount);
            let product_id = response.product_id;
            let msisdn = response.msisdn;
            let flutter_public_key = response.flutter_public_key;
            let tx_ref = response.ref_id;
            FlutterwaveCheckout({
                public_key: flutter_public_key,
                tx_ref: tx_ref,
                amount: amount + fluttercharge,
                currency: "NGN",
                country: "NG",
                payment_options: "card,mobilemoney,ussd",
                customer: {
                    email: email,
                    phone_number: phone,
                    name: customerName,
                },
                callback: function (data) { // specified callback function
                    // console.log(data);
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
                    $.ajax({
                        url: '../prime_recharge',
                        type: 'POST',
                        dataType: "json",
                        data: {product_id:product_id,denomination:amount,send_sms:true,sms_text:'',customer_reference:"myref204020020e2e30dk",number:msisdn,paymentReference:data.transaction_id,gateway:'flutter'},
                        success:function(result){
                            console.log(result)
                            if(result.status == 201 || result.status == 208){
                                // window.location.href='/recharge_successful?operator='+result.operator_name
                                // window.location.href='/user/recharge_successful'
                                // console.log("successful");
                                window.location.href='/user/airtime/success/'+result.ref_id
                            }else{
                                // window.location.href='/user/recharge_successful'
                                // window.location.href='/user/airtime/success/'+result.ref_id
                                Swal.fire({
                                    icon: "error",
                                    title: "Oops...",
                                    text: "Service Currently not available try again later",
                                });
                            }
                        }
                    })
                },
                customizations: {
                    title: "Recharge Pro",
                    description: "Airtime top up.",
                    logo: "https://assets.piedpiper.com/logo.png",
                },
            });
        }
    });
}

/*
   ============================================================
    Data Payment
   ============================================================
 */

function BuyDataWithMonnify(ref_id){
    let pin_code = document.getElementById('pin_code').value;
    if(pin_code === ""){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Enter Transaction Code to autorize transaction",
        })
        return false;
    }
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../getDataDetails',
        type: 'POST',
        data:{paymentGateWay:'monnify',pin_code:pin_code, ref_id:ref_id},
        success: function(response){
            response = JSON.parse(response);
            console.log(response);
            let phone = response.customerPhone;
            let amount = "20";
            let email = response.customerEmail;
            let customerName = response.customerName;
            let finalAmount = "20";
            let monnify_api_key = response.monnify_api_key;
            let monnify_contract_code = response.monnify_contract_code;
            let product_id = response.product_id;
            let msisdn = response.msisdn;
            let dataAmount = response.dataAmount
            let pin = response.pin;
            if(pin == false){
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "invalid Transaction Code Enter your 4 digit Transaction Code",
                })
                return false;
            }
            MonnifySDK.initialize({
                amount: "1",
                currency: "NGN",
                reference: ref_id,
                customerName: customerName,
                customerEmail: email,
                customerMobileNumber: phone,
                apiKey: monnify_api_key,
                contractCode: monnify_contract_code,
                paymentDescription: "PAYMENT FOR DATA TOP UP "+amount,
                paymentMethods: ["CARD"],
                onComplete: function(response) {
                    let paymentStatus = response.status;
                    let amountPaid = response.amountPaid;
                    let paymentReference = response.paymentReference
                    console.log(response);
                    if (response.status === "SUCCESS") {
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: '../dataRecharge',
                            type: 'POST',
                            dataType: "json",
                            data: {product_id:product_id,denomination:amount,send_sms:true,sms_text:'',customer_reference:ref_id,number:msisdn,paymentReference:paymentReference,dataAmount:dataAmount,gateway:'monnify',ref_id:ref_id},
                            success:function(result){
                                console.log(result)
                                if(result.status == 201 || result.status == 208){
                                    window.location.href='/user/data/success/'+result.ref_id
                                }else{
                                    Swal.fire({
                                        icon: "error",
                                        title: "Oops...",
                                        text: "Service Currently not available try again later",
                                    });
                                }
                                // else if(result.status == 434){
                                //     window.location.href='/user/data_failed'
                                // }
                            }
                        })
                    //Implement what happens when transaction is completed.
                    // console.log(response);
                    }
                },
                onClose: function(data){
                    //Implement what should happen when the modal is closed here
                    console.log(data);
                }
            });
        },
        error: function (response){
            if(response.status === 422){
                console.log(response)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "invalid Transaction Code Enter your 4 digit Transaction Code",
                })
                return false;
            }
        },
    });

}

function BuyDataWithMonnifyTransfer(ref_id){
    let pin_code = document.getElementById('pin_code').value;
    if(pin_code === ""){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Enter Transaction Code to autorize transaction",
        })
        return false;
    }
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../getDataDetails',
        type: 'POST',
        data:{paymentGateWay:'monnify',pin_code:pin_code,ref_id:ref_id},
        success: function(response){
            response = JSON.parse(response);
            console.log(response);
            let phone = response.customerPhone;
            let amount = "1";
            let email = response.customerEmail;
            let customerName = response.customerName;
            let finalAmount = "1";
            let monnify_api_key = response.monnify_api_key;
            let monnify_contract_code = response.monnify_contract_code;
            let product_id = response.product_id;
            let msisdn = response.msisdn;
            let dataAmount = response.dataAmount
            if(finalAmount > 50000){
                finalAmount = 500 + amount;
            }
            let pin = response.pin;
            if(pin == false){
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "invalid Transaction Code Enter your 4 digit Transaction Code",
                })
                return false;
            }
            MonnifySDK.initialize({
                amount: "1",
                currency: "NGN",
                reference: ref_id,
                customerName: customerName,
                customerEmail: email,
                customerMobileNumber: phone,
                apiKey: monnify_api_key,
                contractCode: monnify_contract_code,
                paymentDescription: "PAYMENT FOR DATA TOP UP "+amount,
                paymentMethods: ["ACCOUNT_TRANSFER"],
                onComplete: function(response) {
                    let paymentStatus = response.status;
                    let amountPaid = response.amountPaid;
                    let paymentReference = response.paymentReference
                    console.log(response);
                    if (response.paymentStatus === "PAID") {
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: '../dataRecharge',
                            type: 'POST',
                            dataType: "json",
                            data: {product_id:product_id,denomination:amount,send_sms:true,sms_text:'',customer_reference:"myref204020020e2e30dk",number:msisdn,paymentReference:paymentReference,dataAmount:dataAmount,gateway:'monnify',ref_id:ref_id},
                            success:function(result){
                                console.log(result)
                                if(result.status == 201 || result.status == 208){
                                    window.location.href='/user/data/success/'+result.ref_id
                                }else{
                                    Swal.fire({
                                        icon: "error",
                                        title: "Oops...",
                                        text: "Service Currently not available try again later",
                                    });
                                }
                            }
                        })
                    }
                },
                onClose: function(data){
                    console.log(data);
                }
            });
        },
        error: function (response){
            if(response.status === 422){
                console.log(response)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "invalid Transaction Code Enter your 4 digit Transaction Code",
                })
                return false;
            }
        },
    });

}

function BuyDataWithFlutter() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    
    $.ajax({
        url: 'getDataDetails',
        type: 'POST',
        data:{paymentGateway:'flutter'},
        success: function (response){
            response = JSON.parse(response);
            console.log(response);
            let phone = response.customerPhone;
            let amount = "1";
            let email = response.customerEmail;
            let customerName = response.customerName;
            let finalAmount = "1";
            let flutter_public_key = response.flutter_public_key;
            let flutter_encryption_key = response.flutter_encryption_key;
            let product_id = response.product_id;
            let msisdn = response.msisdn;
            let dataAmount = "1";
            let tx_ref = response.ref_id;
            FlutterwaveCheckout({
                public_key: flutter_public_key,
                tx_ref: tx_ref,
                amount: "1",
                currency: "NGN",
                country: "NG",
                payment_options: "card,mobilemoney,ussd",
                customer: {
                    email: email,
                    phone_number: phone,
                    name: customerName,
                },
                callback: function (data) { // specified callback function
                    // console.log(data);
                    let paymentReference = data.transaction_id;
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
                    $.ajax({
                        url: 'dataRecharge',
                        type: 'POST',
                        dataType: "json",
                        data: {product_id:product_id,denomination:amount,send_sms:true,sms_text:'',customer_reference:"myref204020020e2e30dk",number:msisdn,paymentReference:paymentReference,dataAmount:dataAmount,gateway:'flutter'},
                        success:function(result){
                            console.log(result)
                            if(result.status == 201 || result.status == 208) {
                                window.location.href='/user/data/success/'+result.ref_id
                            }else{
                                Swal.fire({
                                    icon: "error",
                                    title: "Oops...",
                                    text: "Service Currently not available try again later",
                                });
                            }
                        }
                    })
                },
                customizations: {
                    title: "RechargePro",
                    description: "Data top up.",
                    logo: "https://assets.piedpiper.com/logo.png",
                },
            });
        }
    });
}
/*
   ============================================================
    Cable TV Payment
   ============================================================
*/

function SubscribeCableTVWithFlutter(){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: 'getCableTvDetails',
        type: 'POST',
        data:{paymentGateWay:'flutter'},
        contentType: false,
        processData: false,
        success:function(response){
            response = $.parseJSON(response);
            console.log(response);
            let basketID = response.basketID
            let cardNumber = response.cardNumber
            let accountNumber = response.accountNumber
            let currentCustomerBoquetCode = response.currentCustomerBoquetCode
            let currentCustomerBoquetName = response.currentCustomerBoquetName
            let currentCustomerBoquetPrice =  response.currentCustomerBoquetPrice
            let customerPhone = response.customerPhone
            let customerEmail = response.customerEmail
            let customerName = response.customerName
            let dstvCustomerNumber = response.dstvCustomerNumber
            let provider = response.provider
            let selectedBouquetCode = response.selectedBouquetCode
            let selectedBouquetName = response.selectedBouquetName
            let selectedBouquetPrice = response.selectedBouquetPrice
            let flutter_public_key = response.flutter_public_key
            let totalAmountToPay = response.totalAmountToPay
            let tx_ref = response.ref
            FlutterwaveCheckout({
                public_key: flutter_public_key,
                tx_ref: tx_ref,
                amount: totalAmountToPay,
                currency: "NGN",
                country: "NG",
                payment_options: "card,mobilemoney,ussd",
                customer: {
                    email: customerEmail,
                    phone_number: customerPhone,
                    name: customerName,
                },
                callback: function (data) { // specified callback function
                    console.log(data);
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
                    $.ajax({
                        url: 'single/cableTvSingleTopUp',
                        type: 'POST',
                        dataType: "json",
                        data: {responseJSON:response,paymentReference:data.transaction_id,gateway:'flutter'},
                        success:function(result){
                            console.log(result)
                            if(result.ResultCode === "00"){
                                window.location.href = '/user/cabletv/success/'+result.MerchantReference
                            }

                        }
                    })
                },
                customizations: {
                    title: "Recharge Pro",
                    description: selectedBouquetName+" Subscription",
                    logo: "https://assets.piedpiper.com/logo.png",
                },
            });



        },
    })

}

function SubscribeCableTVWithMonnify(ref_id){
    let pin_code = document.getElementById('pin_code').value;
    if(pin_code === ""){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Enter Transaction Code to autorize transaction",
        })
        return false;
    }
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../getCableTvDetails',
        type: 'POST',
        data:{paymentGateWay:'monnify', pin_code:pin_code,ref_id:ref_id},
        success:function(response){
            response = $.parseJSON(response);
            console.log(response);
            let customerPhone = response.customerPhone
            let customerEmail = response.customerEmail
            let customerName = response.customerName
            let provider = response.provider
            let totalAmountToPay = response.totalAmountToPay
            MonnifySDK.initialize({
                amount: parseInt(totalAmountToPay),
                currency: "NGN",
                reference: ref_id,
                customerName: customerName,
                customerEmail: customerEmail,
                customerMobileNumber: customerPhone,
                apiKey: response.monnify_api_key,
                contractCode: response.monnify_contract_code,
                paymentDescription: "PAYMENT FOR CABLE TV SUBSCRIPTION",
                paymentMethods: ["CARD"],
                onComplete: function(data) {
                    console.log(data);
                    if (data.status === "SUCCESS") {
                        let paymentReference = data.paymentReference
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: '../single/cableTvSingleTopUp',
                            type: 'POST',
                            dataType: "json",
                            data: {responseJSON:response,paymentReference:data.paymentReference,gateway:'monnify',provider:provider,ref_id:ref_id},
                            success:function(result){
                                console.log(result)
                                if(result.ResultCode === "00"){
                                    window.location.href = '/user/cabletv/success/'+result.MerchantReference
                                }
    
                            },
                            error:function(res){
                                console.log(res)
                            }
                        })
                    }
                },
                onClose: function(response){

                }
            });
        },
        error:function(response){
            if(response.status === 422){
                console.log(response)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Invalid Transaction Code Enter your 4 digit Transaction Code",
                })
                return false;
            }
        }
    })

}

function SubscribeCableTVWithMonnifyTransfer(ref_id){
    let pin_code = document.getElementById('pin_code').value;
    if(pin_code === ""){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Enter Transaction Code to autorize transaction",
        })
        return false;
    }
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../getCableTvDetails',
        type: 'POST',
        data:{paymentGateWay:'monnify', pin_code:pin_code,ref_id:ref_id},
        success:function(response){
            response = $.parseJSON(response);
            console.log(response);
            let customerPhone = response.customerPhone
            let customerEmail = response.customerEmail
            let customerName = response.customerName
            let provider = response.provider
            let totalAmountToPay = response.totalAmountToPay
            if(totalAmountToPay > 50000){
                totalAmountToPay = totalAmountToPay + 500;
            }
            MonnifySDK.initialize({
                amount: parseInt(totalAmountToPay),
                currency: "NGN",
                reference: ref_id,
                customerName: customerName,
                customerEmail: customerEmail,
                customerMobileNumber: customerPhone,
                apiKey: response.monnify_api_key,
                contractCode: response.monnify_contract_code,
                paymentDescription: "PAYMENT FOR CABLE TV SUBSCRIPTION",
                paymentMethods: ["ACCOUNT_TRANSFER"],
                onComplete: function(data) {
                    console.log(data);
                    if (data.paymentStatus === "PAID") {
                        let paymentReference = data.paymentReference
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: '../single/cableTvSingleTopUp',
                            type: 'POST',
                            dataType: "json",
                            data: {responseJSON:response,paymentReference:data.paymentReference,gateway:'monnify',provider:provider,ref_id:ref_id},
                            success:function(result){
                                console.log(result)
                                if(result.ResultCode === "00"){
                                    window.location.href = '/user/cabletv/success/'+result.MerchantReference
                                }
    
                            }
                        })
                    }
                },
                onClose: function(response){

                }
            });
        },
        error:function(response){
            if(response.status === 422){
                console.log(response)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Invalid Transaction Code Enter your 4 digit Transaction Code",
                })
                return false;
            }
        }
    })

}

/*
   ============================================================
    Waec Payment
   ============================================================
*/
function PayWeacPinWithFlutter(){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../payWeacPin',
        type: 'POST',
        data:{paymentGateWay:'flutter'},
        contentType: false,
        processData: false,
        success:function(response){
            response = $.parseJSON(response);
            console.log(response);
            let variation_code = response.variation_code
            let variation_amount = response.variation_amount
            let customerEmail = response.customerEmail
            let customerName = response.customerName
            let customerphone = response.customerphone
            let email = response.email
            let phone_number = response.phone_number
            let quantity = response.quantity
            let tx_ref = response.reference
            let response_description = response.response_description
            let serviceID = response.serviceID
            let flutter_public_key = response.flutter_public_key
            let flutter_encryption_key = response.flutter_encryption_key
            let monnify_api_key = response.monnify_api_key
            let monnify_contract_code = response.monnify_contract_code
            let finalAmount = response.totalAmount
            let request_id = response.reference
            FlutterwaveCheckout({
                public_key: flutter_public_key,
                tx_ref: tx_ref,
                amount: finalAmount,
                currency: "NGN",
                country: "NG",
                payment_options: "card,mobilemoney,ussd",
                customer: {
                    email: customerEmail,
                    phone_number: customerphone,
                    name: customerName,
                },
                callback: function (data) { // specified callback function
                    // console.log(data);
                    let paymentReference = data.transaction_id;
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
                    $.ajax({
                        url: '../BuyPin',
                        type: 'POST',
                        dataType: "json",
                        data: {serviceID:serviceID,phone:phone_number,email:email,request_id:request_id,variation_code:variation_code,quantity:quantity,tx_ref:tx_ref,paymentReference:paymentReference,gateway:'flutter'},
                        success:function(result){
                            console.log(result)
                            if(result.responseCode == "000"){
                                window.location.href = '/user/education/waec/success/'+result.ref_id
                            }else if(result.responseCode == '099'){
                                window.location.href = '/user/education/waec/pending/'+result.ref_id
                            }else if(result.responseCode == '016'){
                                window.location.href = '/user/education/waec/failed/'+result.ref_id
                            }
                        }
                    })
                },
                customizations: {
                    title: "Recharge Pro",
                    description: "Data top up.",
                    logo: "https://assets.piedpiper.com/logo.png",
                },
            });

        },
    })

}

function PayWaecWithMonnify(ref_id){
    let pin_code = document.getElementById('pin_code').value;
    if(pin_code === ""){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Enter Transaction Code to autorize transaction",
        })
        return false;
    }
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../payWeacPin',
        type: 'POST',
        data:{paymentGateWay:'monnify', pin_code:pin_code,ref_id:ref_id},
        success: function(response){
            response = $.parseJSON(response);
            console.log(response);
            let customerEmail = response.customerEmail
            let customerName = response.customerName
            let customerphone = response.customerphone
            let flutter_public_key = response.flutter_public_key
            let flutter_encryption_key = response.flutter_encryption_key
            let monnify_api_key = response.monnify_api_key
            let monnify_contract_code = response.monnify_contract_code
            MonnifySDK.initialize({
                amount: parseInt(response.cardAmount),
                currency: "NGN",
                reference: ref_id,
                customerName: customerName,
                customerEmail: customerEmail,
                customerMobileNumber: customerphone,
                apiKey: monnify_api_key,
                contractCode: monnify_contract_code,
                paymentDescription: "PAYMENT FOR WAEC RESULT CHECKER PIN",
                paymentMethods: ["CARD"],
                onComplete: function(response){
                    console.log(response)
                    if (response.status === "SUCCESS") {
                        let paymentReference = response.paymentReference
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: '../../BuyPin',
                            type: 'POST',
                            dataType: "json",
                            data: {paymentReference:paymentReference,gateway:'monnify',ref_id:ref_id},
                            success:function(result){
                                console.log(result)
                                if(result.responseCode == "000"){
                                    window.location.href = '/user/education/waec/success/'+result.ref_id
                                }else if(result.responseCode == '099'){
                                    window.location.href = '/user/education/waec/pending/'+result.ref_id
                                }else if(result.responseCode == '016'){
                                    window.location.href = '/user/education/waec/failed/'+result.ref_id
                                }
                            }
                        })
                    }
                    // console.log(response);
                },
                onClose: function(data){
                    //Implement what should happen when the modal is closed here
                    // console.log(data);
                }
            });
        }, 
        error: function (response){
            if(response.status === 422){
                console.log(response)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Invalid Transaction Code Enter your 4 digit Transaction Code",
                })
                return false;
            }
        },
    });

}

function PayWaecWithMonnifyTransfer(ref_id){
    let pin_code = document.getElementById('pin_code').value;
    if(pin_code === ""){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Enter Transaction Code to autorize transaction",
        })
        return false;
    }
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../payWeacPin',
        type: 'POST',
        data:{paymentGateWay:'monnify', pin_code:pin_code,ref_id:ref_id},
        success: function(response){
            response = $.parseJSON(response);
            console.log(response);
            let customerEmail = response.customerEmail
            let customerName = response.customerName
            let customerphone = response.customerphone
            let flutter_public_key = response.flutter_public_key
            let flutter_encryption_key = response.flutter_encryption_key
            let monnify_api_key = response.monnify_api_key
            let monnify_contract_code = response.monnify_contract_code
            MonnifySDK.initialize({
                amount: parseInt(response.transferAmount),
                currency: "NGN",
                reference: ref_id,
                customerName: customerName,
                customerEmail: customerEmail,
                customerMobileNumber: customerphone,
                apiKey: monnify_api_key,
                contractCode: monnify_contract_code,
                paymentDescription: "PAYMENT FOR WAEC RESULT CHECKER PIN",
                paymentMethods: ["ACCOUNT_TRANSFER"],
                onComplete: function(response){
                    console.log(response)
                    if (response.paymentStatus === "PAID") {
                        let paymentReference = response.paymentReference
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: '../../BuyPin',
                            type: 'POST',
                            dataType: "json",
                            data: {paymentReference:paymentReference,gateway:'monnify',ref_id:ref_id},
                            success:function(result){
                                console.log(result)
                                if(result.responseCode == "000"){
                                    window.location.href = '/user/education/waec/success/'+result.ref_id
                                }else if(result.responseCode == '099'){
                                    window.location.href = '/user/education/waec/pending/'+result.ref_id
                                }else if(result.responseCode == '016'){
                                    window.location.href = '/user/education/waec/failed/'+result.ref_id
                                }
                            }
                        })
                    }
                    // console.log(response);
                },
                onClose: function(data){
                    //Implement what should happen when the modal is closed here
                    // console.log(data);
                }
            });
        }, 
        error: function (response){
            if(response.status === 422){
                console.log(response)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Invalid Transaction Code Enter your 4 digit Transaction Code",
                })
                return false;
            }
        },
    });

}
/*
    =================================
    Startimes
    =================================
 */

function payStartimesRechargeWithMonnify(){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../../getStartimesRechargeDetails',
        type: 'GET',
        dataType: 'json',
        data:{paymentGateWay:'monnify'},
        success:function(res){
            console.log(res)
            let packageCode = res.package_code
            let bouquet_price = res.bouquet_price
            let totalAmount = res.total_amount
            let serviceCharge = res.service_charge
            let smartcard_number = res.smartcard_number
            let bouquet_name = res.bouquet_name
            let bouquet_validity = res.bouquet_validity
            let customerName = res.customer_name
            let mobile = res.mobile
            let monnify_api_key = res.monnify_api_key
            let monnify_contract_code = res.monnify_contract_code
            let flutter_public_key = res.flutter_public_key
            let flutter_encryption_key = res.flutter_encryption_key
            let loggeInUser = res.loggeInUser
            let loggedInEmail = res.loggedInEmail
            let loggedInPhone = res.loggedInPhone
            let starResponse = res
            MonnifySDK.initialize({
                 amount: totalAmount,
                 currency: "NGN",
                 reference: '' + Math.floor((Math.random() * 1000000000) + 1),
                 customerName: loggeInUser,
                 customerEmail: loggedInEmail,
                 customerMobileNumber: loggedInPhone,
                 apiKey: monnify_api_key,
                 contractCode: monnify_contract_code,
                 paymentDescription: "Cable tv subscription",
                 paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
                 onComplete: function(response){
                     console.log(response);
                     let paymentReference = response.paymentReference
                     if (response.paymentStatus !== "USER_CANCELLED") {
                         $.ajaxSetup({
                             headers: {
                                 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                             }
                         });
                         $.ajax({
                             url: '../../../rechargeStartimes',
                             type: 'POST',
                             dataType: 'json',
                             data:{details:starResponse, paymentReference:paymentReference, paymentGateWay:'monnify'},
                             success:function(data){
                                 console.log(data)
                                 if(data.status === 'success'){
                                     window.location.href = '/user/cabletv/success/'+data.MerchantReference
                                 }
                             }
                         })
                     }
                 },
                 onClose: function(data){
                     //Implement what should happen when the modal is closed here
                 }
             })
        }
    })
}


function payStartimes(){
    let pin = document.getElementById('transact_code').value;
    let code_err = document.getElementById('code_err');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../../checkPinCode',
        type: 'POST',
        dataType: 'json',
        data: {pin:pin},
        success: function (res) {
            console.log(res)
            if(!res.status){
                document.getElementById('transact_code').classList.add('is-invalid');
                code_err.classList.add('invalid-feedback');
                code_err.textContent = "Invalid transaction code.";
            }else{
                document.getElementById('transact_code').classList.remove('is-invalid');
                code_err.classList.remove('invalid-feedback');
                code_err.textContent = "";
                //getSubscriberDetails
                $.ajax({
                    url: 'getStartimeDetails',
                    type: 'GET',
                    dataType: 'json',
                    data: {paymentGateWay: 'flutter'},
                    success: function (res) {
                        console.log(res)
                        let mobile = res.mobile
                        let monnify_api_key = res.monnify_api_key
                        let monnify_contract_code = res.monnify_contract_code
                        let flutter_public_key = res.flutter_public_key
                        let flutter_encryption_key = res.flutter_encryption_key
                        let tx_ref = res.ref_id
                        let loggeInUser = res.loggeInUser
                        let loggedInEmail = res.loggedInEmail
                        let loggedInPhone = res.loggedInPhone
                        let starResponse = res
                        let email = res.email
                        let bouquet_name = res.bouquet_name
                        let flutterfee = ((1.4/100) * 1000)
                        let totalAmount = res.tTotal
                        FlutterwaveCheckout({
                            public_key: flutter_public_key,
                            tx_ref: tx_ref,
                            amount: totalAmount,
                            currency: "NGN",
                            country: "NG",
                            payment_options: "card,mobilemoney,ussd",
                            customer: {
                                email: loggedInEmail,
                                phone_number: loggedInPhone,
                                name: loggeInUser,
                            },
                            callback: function (data) { // specified callback function
                                // console.log(data);
                                let paymentReference = data.transaction_id;
                                $.ajaxSetup({
                                    headers: {
                                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                    }
                                });
                                $.ajax({
                                    url: '../../../rechargeStartimesNew',
                                    type: 'POST',
                                    dataType: 'json',
                                    data:{details:starResponse, paymentReference:paymentReference, paymentGateWay:'flutter'},
                                    success:function(data){
                                        console.log(data)
                                        //if(data.status === 'success'){
                                             window.location.href = '/user/cabletv/success/'+data.MerchantReference
                                        //}
                                    }
                                })
                            },
                            customizations: {
                                title: "RechargePro",
                                description: "Startimes Cable tv subscription",
                                logo: "",
                            },
                        });
                    }
                });
            }
            // let packageCode = res.package_code
            // let bouquet_price = res.bouquet_price
        }
    });
}

function payStartimesMonnify(ref_id){
    let pin = document.getElementById('transact_code').value;
    let code_err = document.getElementById('code_err');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../../../checkPinCode',
        type: 'POST',
        dataType: 'json',
        data: {pin:pin},
        success: function (res) {
            console.log(res)
            if(!res.status){
                document.getElementById('transact_code').classList.add('is-invalid');
                code_err.classList.add('invalid-feedback');
                code_err.textContent = "Invalid transaction code.";
            }else{
                document.getElementById('transact_code').classList.remove('is-invalid');
                code_err.classList.remove('invalid-feedback');
                code_err.textContent = "";
                //getSubscriberDetails
                $.ajax({
                    url: '../getStartimeDetails',
                    type: 'GET',
                    dataType: 'json',
                    data: {paymentGateWay: 'monnify', ref_id:ref_id},
                    success: function (res) {
                        console.log(res)
                        let mobile = res.mobile
                        let monnify_api_key = res.monnify_api_key
                        let monnify_contract_code = res.monnify_contract_code
                        let flutter_public_key = res.flutter_public_key
                        let flutter_encryption_key = res.flutter_encryption_key
                        let tx_ref = res.ref_id
                        let loggeInUser = res.loggeInUser
                        let loggedInEmail = res.loggedInEmail
                        let loggedInPhone = res.loggedInPhone
                        let starResponse = res
                        let email = res.email
                        let bouquet_name = res.bouquet_name
                        let totalAmount = res.tTotal
                        MonnifySDK.initialize({
                            amount: parseInt(res.tTotalCard),
                            currency: "NGN",
                            reference: ref_id,
                            customerName: loggeInUser,
                            customerEmail: loggedInEmail,
                            customerMobileNumber: loggedInPhone,
                            apiKey: monnify_api_key,
                            contractCode: monnify_contract_code,
                            paymentDescription: "PAYMENT FOR CABLE TV",
                            paymentMethods: ["CARD"],
                            onComplete: function(response){
                                console.log(response)
                                if (response.paymentStatus !== "USER_CANCELLED") {
                                    let paymentReference = response.paymentReference
                                    $.ajaxSetup({
                                        headers: {
                                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                        }
                                    });
                                    $.ajax({
                                        url: '../../../../rechargeStartimesNew',
                                        type: 'POST',
                                        dataType: 'json',
                                        data:{details:starResponse, paymentReference:paymentReference, paymentGateWay:'monnify', ref_id:ref_id},
                                        success:function(data){
                                            console.log(data)
                                            //if(data.status === 'success'){
                                                window.location.href = '/user/cabletv/success/'+data.MerchantReference
                                            //}
                                        }
                                    })
                                }
                            },
                            onClose: function(response){
                                console.log(response)
                            }
                        });
                    }
                });
            }
            // let packageCode = res.package_code
            // let bouquet_price = res.bouquet_price
        }, 
        error: function (res){
            document.getElementById('transact_code').classList.add('is-invalid');
            code_err.classList.add('invalid-feedback');
            code_err.textContent = "Invalid transaction code.";
        }
    });
}

function payStartimesMonnifyTransfer(ref_id){
    let pin = document.getElementById('transact_code').value;
    let code_err = document.getElementById('code_err');
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../../../checkPinCode',
        type: 'POST',
        dataType: 'json',
        data: {pin:pin},
        success: function (res) {
            console.log(res)
            if(!res.status){
                document.getElementById('transact_code').classList.add('is-invalid');
                code_err.classList.add('invalid-feedback');
                code_err.textContent = "Invalid transaction code.";
            }else{
                document.getElementById('transact_code').classList.remove('is-invalid');
                code_err.classList.remove('invalid-feedback');
                code_err.textContent = "";
                //getSubscriberDetails
                $.ajax({
                    url: '../getStartimeDetails',
                    type: 'GET',
                    dataType: 'json',
                    data: {paymentGateWay: 'monnify', ref_id:ref_id},
                    success: function (res) {
                        console.log(res)
                        let mobile = res.mobile
                        let monnify_api_key = res.monnify_api_key
                        let monnify_contract_code = res.monnify_contract_code
                        let flutter_public_key = res.flutter_public_key
                        let flutter_encryption_key = res.flutter_encryption_key
                        let tx_ref = res.ref_id
                        let loggeInUser = res.loggeInUser
                        let loggedInEmail = res.loggedInEmail
                        let loggedInPhone = res.loggedInPhone
                        let starResponse = res
                        let email = res.email
                        let bouquet_name = res.bouquet_name
                        let totalAmount = res.tTotal
                        MonnifySDK.initialize({
                            amount: parseInt(res.tTotalTransfer),
                            currency: "NGN",
                            reference: ref_id,
                            customerName: loggeInUser,
                            customerEmail: loggedInEmail,
                            customerMobileNumber: loggedInPhone,
                            apiKey: monnify_api_key,
                            contractCode: monnify_contract_code,
                            paymentDescription: "PAYMENT FOR CABLE TV",
                            paymentMethods: ["ACCOUNT_TRANSFER"],
                            onComplete: function(response){
                                console.log(response)
                                if (response.paymentStatus === "PAID") {
                                    let paymentReference = response.paymentReference
                                    $.ajaxSetup({
                                        headers: {
                                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                        }
                                    });
                                    $.ajax({
                                        url: '../../../../rechargeStartimesNew',
                                        type: 'POST',
                                        dataType: 'json',
                                        data:{details:starResponse, paymentReference:paymentReference, paymentGateWay:'monnify', ref_id:ref_id},
                                        success:function(data){
                                            console.log(data)
                                            //if(data.status === 'success'){
                                                window.location.href = '/user/cabletv/success/'+data.MerchantReference
                                            //}
                                        }
                                    })
                                }
                            },
                            onClose: function(response){
                                console.log(response)
                            }
                        });
                    }
                });
            }
            // let packageCode = res.package_code
            // let bouquet_price = res.bouquet_price
        }, 
        error: function (res){
            document.getElementById('transact_code').classList.add('is-invalid');
            code_err.classList.add('invalid-feedback');
            code_err.textContent = "Invalid transaction code.";
        }
    });
}


function payStartimesRechargeWithFlutterwave(){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../../getStartimesRechargeDetails',
        type: 'GET',
        dataType: 'json',
        data: {paymentGateWay: 'flutter'},
        success: function (res) {
            console.log(res)
            let packageCode = res.package_code
            let bouquet_price = res.bouquet_price
            let totalAmount = res.total_amount
            let serviceCharge = res.service_charge
            let smartcard_number = res.smartcard_number
            let bouquet_name = res.bouquet_name
            let bouquet_validity = res.bouquet_validity
            let customerName = res.customer_name
            let mobile = res.mobile
            let monnify_api_key = res.monnify_api_key
            let monnify_contract_code = res.monnify_contract_code
            let flutter_public_key = res.flutter_public_key
            let flutter_encryption_key = res.flutter_encryption_key
            let tx_ref = res.ref_id
            let loggeInUser = res.loggeInUser
            let loggedInEmail = res.loggedInEmail
            let loggedInPhone = res.loggedInPhone
            let starResponse = res
            FlutterwaveCheckout({
                public_key: flutter_public_key,
                tx_ref: tx_ref,
                amount: totalAmount,
                currency: "NGN",
                country: "NG",
                payment_options: "card,mobilemoney,ussd",
                customer: {
                    email: loggedInEmail,
                    phone_number: loggedInPhone,
                    name: loggeInUser,
                },
                callback: function (data) { // specified callback function
                    // console.log(data);
                    let paymentReference = data.transaction_id;
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
                    $.ajax({
                        url: '../../../rechargeStartimes',
                        type: 'POST',
                        dataType: 'json',
                        data:{details:starResponse, paymentReference:paymentReference, paymentGateWay:'flutter'},
                        success:function(data){
                            console.log(data)
                            //if(data.status === 'success'){
                                window.location.href = '/user/cabletv/success/'+data.MerchantReference
                            //}
                        }
                    })
                },
                customizations: {
                    title: "Recharge Pro",
                    description: "Startimes Cable tv subscription",
                    logo: "https://assets.piedpiper.com/logo.png",
                },
            });


        }
    })
}

/*
    ========================================
    Pay Power
    ========================================
 */
function payPowerWithMonnify(ref_id){
    let pin_code = document.getElementById('pin_code').value;
    if(pin_code === ""){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Enter Transaction Code to autorize transaction",
        })
        return false;
    }
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../../../../powerDetails',
        type: 'GET',
        dataType: 'json',
        data: {paymentGateWay: 'monnify',pin_code:pin_code,ref_id:ref_id},
        success: function (res) {
            console.log(res)
            MonnifySDK.initialize({
                amount: res.monnifyCost,
                currency: "NGN",
                reference: ref_id,
                customerName: res.name,
                customerEmail: res.email,
                customerMobileNumber: res.phone,
                apiKey: res.monnify_api_key,
                contractCode: res.monnify_contract_code,
                paymentDescription: res.providerName+" Bill Payment",
                paymentMethods: ["CARD"],
                onComplete: function(response){
                    console.log(response);
                    let paymentReference = response.paymentReference
                    if (response.status === "SUCCESS") {
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: '../../../../../buyPowerWithCard',
                            type: 'POST',
                            dataType: 'json',
                            data:{paymentReference:paymentReference, paymentGateWay:'monnify',ref_id},
                            success:function(data){
                                console.log(data);
                                   window.location.href="/power/electricity/bill/success/"+data.ref;
                            },
                            error:function(data){
                                console.error(data);
                            }
                        })
                    }
                },
                onClose: function(data){
                    console.log(data)
                }
            })
        },
        error: function (response){
            if(response.status === 422){
                console.error(response)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "invalid Transaction Code Enter your 4 digit Transaction Code",
                })
                return false;
            }
        },
    })


}


function payPowerWithMonnifyTransfer(ref_id){
    let pin_code = document.getElementById('pin_code').value;
    if(pin_code === ""){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Enter Transaction Code to autorize transaction",
        })
        return false;
    }
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../../../../powerDetails',
        type: 'GET',
        dataType: 'json',
        data: {paymentGateWay: 'monnify',pin_code:pin_code,ref_id:ref_id},
        success: function (res) {
            console.log(res)
            let amount = res.monnifyCost;
            if(amount > 50000){
                amount = 500 + amount;
            }else{
                amount = (0.01 * amount) + amount;
            }
            MonnifySDK.initialize({
                amount: res.transferCost,
                currency: "NGN",
                reference: ref_id,
                customerName: res.name,
                customerEmail: res.email,
                customerMobileNumber: res.phone,
                apiKey: res.monnify_api_key,
                contractCode: res.monnify_contract_code,
                paymentDescription: res.providerName+" Bill Payment",
                paymentMethods: ["ACCOUNT_TRANSFER"],
                onComplete: function(response){
                    console.log(response);
                    let paymentReference = response.paymentReference
                    if (response.paymentStatus === "PAID") {
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: '../../../../../buyPowerWithCard',
                            type: 'POST',
                            dataType: 'json',
                            data:{paymentReference:paymentReference, paymentGateWay:'monnify',ref_id:ref_id},
                            success:function(data){
                                console.log(data);
                                window.location.href="/power/electricity/bill/success/"+data.ref;
                            },
                            error: function(data){
                                console.error(data)
                            }
                        })
                    }
                },
                onClose: function(data){
                    console.log(data)
                }
            })
        },
        error: function (response){
            if(response.status === 422){
                console.log(response)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "invalid Transaction Code Enter your 4 digit Transaction Code",
                })
                return false;
            }
        },
    })
}

function payPowerWithFlutterWave(){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../../../powerDetails',
        type: 'GET',
        dataType: 'json',
        data: {paymentGateWay: 'monnify'},
        success: function (res) {
            console.log(res);
            FlutterwaveCheckout({
                public_key: res.flutter_public_key,
                tx_ref: res.tx_ref,
                amount: res.flutterCost,
                currency: "NGN",
                country: "NG",
                payment_options: "card,mobilemoney,ussd",
                customer: {
                    email: res.email,
                    phone_number: res.phone,
                    name: res.name,
                },
                callback: function (data) { // specified callback function
                    // console.log(data);
                    let paymentReference = data.transaction_id;
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
                    $.ajax({
                        url: '../../../../buyPowerWithCard',
                        type: 'POST',
                        dataType: 'json',
                        data:{paymentReference:paymentReference, paymentGateWay:'flutter'},
                        success:function(data){
                            console.log(data);
                            // console.log(data.status)
                            //if(data.status === true){
                            window.location.href="/power/electricity/bill/success/"+data.ref;
                            //}
                        }
                    })
                },
                customizations: {
                    title: "Recharge Pro",
                    description: "Electricity Bill Payment",
                    logo: "https://assets.piedpiper.com/logo.png",
                },
            });
        }
    })

}
