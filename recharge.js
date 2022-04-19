function payWithMonnify(ref) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '/getGuestAirtimeDetails/'+ref,
        type: 'POST',
        dataType: "json",
        success:function(result){
            console.log(result)
            let amount = result.amount
            amount = parseInt(amount);
            let email = result.email;
            if (email == null){
                email = "support@rechargepro.ng"
            }
            let msisdn = result.msisdn
            let phone = result.phone
            let provider = result.provider
            let totalAmount = result.totalAmount
            let product_id = result.product_id
            let monnify_api_key = result.monnify_api_key
            let monnify_contract_code = result.monnify_contract_code
            let serviceCharge = result.serviceCharge
            let balStatus = result.balanceStats
            totalAmount = parseInt(totalAmount)
            if(!balStatus){
                swal('error', 'Sorry service currently not available try again later', 'error');
            }else{
                MonnifySDK.initialize({
                    amount: parseInt(totalAmount),
                    currency: "NGN",
                    reference: '' + Math.floor((Math.random() * 1000000000) + 1),
                    // customerName: "John Doe",
                    customerEmail: email,
                    customerMobileNumber: phone,
                    apiKey: monnify_api_key,
                    contractCode: monnify_contract_code,
                    paymentDescription: provider+' '+amount+' '+'Airtime top up' ,
                    paymentMethods: ["CARD"],
                    onComplete: function(response){
                        let paymentReference = response.paymentReference
                        if (response.responseCode !== "USER_CANCELLED") {
                            $.ajaxSetup({
                                headers: {
                                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                }
                            });
                            $.ajax({
                                url: '/processAirtime',
                                type: 'POST',
                                dataType: "json",
                                data: {product_id:product_id,denomination:amount,send_sms:true,sms_text:'',customer_reference:ref,number:phone,msisdn:msisdn,operator:provider,gateway:'monnify',paymentReference:paymentReference,serviceCharge:serviceCharge},
                                success:function(result){
                                    console.log(result)
                                    // swal('SUCCESSFUL', result.operator_name+' Top Up Successful', 'success')
                                    window.location.href='/airtime/success/'+result.ref_id
    
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
            }
        }
    })
}

function payWithMonnifyTransfer(ref) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '/getGuestAirtimeDetails/'+ref,
        type: 'POST',
        dataType: "json",
        success:function(result){
            console.log(result)
            let amount = result.amount
            
            amount = parseInt(amount);
            let email = result.email;
            if (email == null){
                email = "support@rechargepro.ng"
            }
            let msisdn = result.msisdn
            let phone = result.phone
            let provider = result.provider
            let totalAmount = result.totalAmount
            let product_id = result.product_id
            let monnify_api_key = result.monnify_api_key
            let monnify_contract_code = result.monnify_contract_code
            let serviceCharge = result.serviceCharge
            let balStatus = result.balanceStats
            totalAmount = parseInt(totalAmount)
            if(amount > 50000){
                totalAmount = amount + 500
            }else{
                totalAmount = (0.01 * amount) + amount
            }
            if(!balStatus){
                swal('error', 'Sorry service currently not available try again later', 'error');
            }else{
                MonnifySDK.initialize({
                    amount: parseInt(totalAmount),
                    currency: "NGN",
                    reference: '' + Math.floor((Math.random() * 1000000000) + 1),
                    // customerName: "John Doe",
                    customerEmail: email,
                    customerMobileNumber: phone,
                    apiKey: monnify_api_key,
                    contractCode: monnify_contract_code,
                    paymentDescription: provider+' '+amount+' '+'Airtime top up' ,
                    paymentMethods: ["ACCOUNT_TRANSFER"],
                    onComplete: function(response){
                        let paymentReference = response.paymentReference
                        if (response.responseCode !== "USER_CANCELLED") {
                            $.ajaxSetup({
                                headers: {
                                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                }
                            });
                            $.ajax({
                                url: '/processAirtime',
                                type: 'POST',
                                dataType: "json",
                                data: {product_id:product_id,denomination:amount,send_sms:true,sms_text:'',customer_reference:ref,number:phone,msisdn:msisdn,operator:provider,gateway:'monnify',paymentReference:paymentReference,serviceCharge:serviceCharge},
                                success:function(result){
                                    console.log(result)
                                    // swal('SUCCESSFUL', result.operator_name+' Top Up Successful', 'success')
                                    window.location.href='/airtime/success/'+result.ref_id
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
            }
        }
    })
}

function payAirtimeWithFlutterwave(){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '/getGuestAirtimeDetails',
        type: 'POST',
        dataType: "json",
        success:function(result){
            console.log(result);
            let amount = result.amount
            amount = parseInt(amount);
            let email = result.email;
            if (email == null){
                email = "support@rechargepro.ng"
            }
            let msisdn = result.msisdn
            let phone = result.phone
            let provider = result.provider
            let totalAmount = result.totalAmount
            let product_id = result.product_id
            let monnify_api_key = result.monnify_api_key
            let monnify_contract_code = result.monnify_contract_code
            let serviceCharge = result.serviceCharge
            let flutter_encryption_key = result.flutter_encryption_key
            let flutter_public_key = result.flutter_public_key
            let name = result.name
            let tx_ref = result.tx_ref
            totalAmount = parseInt(totalAmount)
            let balStatus = result.balanceStats
            if(!balStatus){
                swal('Oops', 'Sorry service currently not available try again later', 'error');
            }else{
                FlutterwaveCheckout({
                    public_key: flutter_public_key,
                    tx_ref: tx_ref,
                    amount: totalAmount,
                    currency: "NGN",
                    country: "NG",
                    payment_options: "card,mobilemoney,ussd",
                    customer: {
                        email: email,
                        phone_number: phone,
                        name: name,
                    },
                    callback: function (data) { // specified callback function
                        console.log(data);
                        let paymentReference = data.transaction_id
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: '/processAirtime',
                            type: 'POST',
                            dataType: "json",
                            data: {
                                product_id: product_id,
                                denomination: amount,
                                send_sms: true,
                                sms_text: '',
                                customer_reference: "myref204020020e2e30dk",
                                number: phone,
                                msisdn: msisdn,
                                operator: provider,
                                gateway: 'flutterwave',
                                paymentReference: paymentReference,
                                serviceCharge: serviceCharge
                            },
                            success: function (result) {
                                console.log(result)
                                // swal('SUCCESSFUL', result.operator_name+' Top Up Successful', 'success')
                                window.location.href = '/airtime/success/' + result.ref_id
    
                            }
                        });
                    },
                    customizations: {
                        title: "Recharge Pro",
                        description: "Airtime Subscription",
                        logo: "https://assets.piedpiper.com/logo.png",
                    },
                });
            }
        }
    })

}


//get Bundles form primeAirtimes
function getBundles(e){
    let phoneNumber = e.value;
    let bundle = document.getElementById('lll');
    let formoption  = "";
    if(phoneNumber.toString().length === 11) {
        document.getElementById('loading-data').classList.remove('d-none');
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            url: '/getBundleFromPrime',
            type:'POST',
            data:{phone_number:phoneNumber},
            success:function(response){
                let data = response['products'];
                let operator = response['opts'];
                if (data !== undefined){
                    document.getElementById('primeOperator').value=operator.operator;
                    document.getElementById('loading-data').classList.add('d-none');
                    for(let i = 1; i < data.length; i++){
                        let data_amount = parseInt(data[i].data_amount);
                        let denomination = data[i].denomination;
                        let validity = data[i].validity;
                        let product_id = data[i].product_id;
                        let amountDetails =  '';
                        if(data_amount >= 1000){
                            amountDetails = (data_amount/1000) + 'GB'
                        }else{
                            amountDetails = data_amount+ 'MB'
                        }
                        formoption += "<option value='"+product_id+"'>"+amountDetails+" FOR "+validity+" "+denomination+"</option>"
                    }
                    document.getElementById('dataBundleContainer').classList.remove('d-none');
                    $('#lll').html(formoption);
                }

            }
        });
    }else{
        document.getElementById('loading-data').classList.add('d-none');
        document.getElementById('dataBundleContainer').classList.add('d-none');
        console.log('invalid phone number');
    }
}

function payDataWithMonnify(ref){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '/getGuestDataDetails/'+ref,
        type: 'POST',
        dataType: "json",
        success:function(result){
            console.log(result)
            let amount = result.denomination
            amount = parseInt(amount);
            let email = result.email;
            if (email == null){
                email = "support@rechargepro.ng"
            }
            let msisdn = result.msisdn
            let phone = result.phone
            let provider = result.operator
            let totalAmount = parseInt(result.totalAmount)
            let product_id = result.product_id
            let monnify_api_key = result.monnify_api_key
            let monnify_contract_code = result.monnify_contract_code
            let serviceCharge = result.serviceCharge
            let dataAmount = result.dataAmount

            MonnifySDK.initialize({
                amount: parseInt(totalAmount),
                currency: "NGN",
                reference: '' + Math.floor((Math.random() * 1000000000) + 1),
                // customerName: "John Doe",
                customerEmail: email,
                customerMobileNumber: phone,
                apiKey: monnify_api_key,
                contractCode: monnify_contract_code,
                paymentDescription: provider+' '+dataAmount+' '+'data top up' ,
                paymentMethods: ["CARD"],
                onComplete: function(response){
                    let paymentReference = response.paymentReference
                    if (response.responseCode !== "USER_CANCELLED") {
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: '/processDataPayment',
                            type: 'POST',
                            dataType: "json",
                            data: {product_id:product_id,denomination:amount,send_sms:true,sms_text:'',customer_reference:ref,number:phone,msisdn:msisdn,operator:provider,gateway:'monnify',paymentReference:paymentReference,serviceCharge:serviceCharge},
                            success:function(result){
                                console.log(result)
                                // swal('SUCCESSFUL', result.operator_name+' Top Up Successful', 'success')
                                window.location.href='/data/success/'+result.ref_id

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
        }
    });
}

function payDataWithMonnifyTransfer(ref){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '/getGuestDataDetails/'+ref,
        type: 'POST',
        dataType: "json",
        success:function(result){
            console.log(result)
            let amount = result.denomination
            amount = "1";
            let email = result.email;
            if (email == null){
                email = "madleets139@gmail.com"
            }
            let msisdn = result.msisdn
            let phone = result.phone
            let provider = result.operator
            let totalAmount = parseInt(result.totalAmount)
            let product_id = result.product_id
            let monnify_api_key = result.monnify_api_key
            let monnify_contract_code = result.monnify_contract_code
            let serviceCharge = result.serviceCharge
            let dataAmount = result.dataAmount
            if(amount > 50000){
                totalAmount = "1" + 500;
            }else{
                totalAmount = (0.01 * totalAmount) + totalAmount
            }

            MonnifySDK.initialize({
                amount: "1",
                currency: "NGN",
                reference: '' + Math.floor((Math.random() * 1000000000) + 1),
                // customerName: "John Doe",
                customerEmail: email,
                customerMobileNumber: phone,
                apiKey: monnify_api_key,
                contractCode: monnify_contract_code,
                paymentDescription: provider+' '+dataAmount+' '+'data top up' ,
                paymentMethods: ["ACCOUNT_TRANSFER"],
                onComplete: function(response){
                    console.log(response)
                    let paymentReference = response.paymentReference
                    if (response.paymentStatus === "PAID") {
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: '/processDataPayment',
                            type: 'POST',
                            dataType: "json",
                            data: {product_id:product_id,denomination:amount,send_sms:true,sms_text:'',customer_reference:ref,number:phone,msisdn:msisdn,operator:provider,gateway:'monnify',paymentReference:paymentReference,serviceCharge:serviceCharge},
                            success:function(result){
                                console.log(result)
                                // swal('SUCCESSFUL', result.operator_name+' Top Up Successful', 'success')
                                window.location.href='/data/success/'+result.ref_id

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
        }
    });
}

function payDataWithFlutterWave(){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '/getGuestDataDetails',
        type: 'POST',
        dataType: "json",
        success:function(result){
            console.log(result);
            let amount = result.denomination
            amount = "1";
            let email = result.email;
            if (email == null){
                email = "madleets139@gmail.com"
            }
            let msisdn = result.msisdn
            let phone = result.phone
            let provider = result.operator
            let totalAmount = parseInt(result.totalAmount)
            let product_id = result.product_id
            let monnify_api_key = result.monnify_api_key
            let monnify_contract_code = result.monnify_contract_code
            let serviceCharge = result.serviceCharge
            let dataAmount = result.dataAmount
            let flutter_encryption_key = result.flutter_encryption_key
            let flutter_public_key = result.flutter_public_key
            let name = result.name
            let tx_ref = result.tx_ref
            totalAmount = parseInt(totalAmount)
            let balanceStats = result.balanceStats
            if(!balanceStats){
                swal('Oops', 'Service Currently not available', 'error');
            }else{
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
                        name: name,
                    },
                    callback: function (data) { // specified callback function
                        console.log(data);
                        let paymentReference = data.transaction_id
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: '/processDataPayment',
                            type: 'POST',
                            dataType: "json",
                            data: {product_id:product_id,denomination:amount,send_sms:true,sms_text:'',customer_reference:"myref204020020e2e30dk",number:phone,msisdn:msisdn,operator:provider,gateway:'flutterwave',paymentReference:paymentReference,serviceCharge:serviceCharge},
                            success:function(result){
                                console.log(result)
                                // swal('SUCCESSFUL', result.operator_name+' Top Up Successful', 'success')
                                window.location.href='/data/success/'+result.ref_id
    
                            }
                        })
                    },
                    customizations: {
                        title: "Recharge Pro",
                        description: "Airtime Subscription",
                        logo: "https://assets.piedpiper.com/logo.png",
                    },
                });
            }
        }
    })

}

function getBouquetPrice(e){
    let bouquetProductID = e.value;
    document.getElementById('cable_tv_subscriberName').value=e.options[e.selectedIndex].text
    let cableTV = document.getElementById('cable_tv_subscriber').value;
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '/cabletv/guest/price/getPrice',
        type: 'POST',
        data: {operator:cableTV, p_id:bouquetProductID},
        success:function(data){
            data = $.parseJSON(data)
            console.log(data)
            document.getElementById('cost').textContent="â‚¦"+data.price
        }
    });
}

function SubscribeCableTVWithFlutter(){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../getCableTvDetails',
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
            let balanceStats = response.balanceStats
            if(!balanceStats){
                swal('Oops', 'Service currently not available try again later', 'error');
            }else{
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
                            url: '../cableTvSingleTopUp',
                            type: 'POST',
                            dataType: "json",
                            data: {responseJSON:response,paymentReference:data.transaction_id,gateway:'flutter'},
                            success:function(result){
                                console.log(result)
                                // if(result.ResultCode === "00"){
                                    window.location.href = '/cabletv/success/'+result.MerchantReference
                                // }
    
                            }
                        })
                    },
                    customizations: {
                        title: "Recharge Pro",
                        description: selectedBouquetName+" Subscription",
                        logo: "https://assets.piedpiper.com/logo.png",
                    },
                });
            }




        },
    })

}

function SubscribeCableTVWithMonnify(ref_id){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../getCableTvDetails',
        type: 'POST',
        data:{paymentGateWay:'monnify', ref_id:ref_id},
        success:function(res){
            let response = JSON.parse(res);
            console.log(response);
            MonnifySDK.initialize({
                amount: parseInt(response.totalAmountToPayCard),
                currency: "NGN",
                reference: ref_id,
                customerName: response.customerName,
                customerEmail: response.customerEmail,
                customerMobileNumber: response.customerPhone,
                apiKey: response.monnify_api_key,
                contractCode: response.monnify_contract_code,
                paymentDescription: "CABLE TV SUBSCRIPTION" ,
                paymentMethods: ["CARD"],
                onComplete: function(response){
                    let paymentReference = response.paymentReference
                    if (response.responseCode !== "USER_CANCELLED") {
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: '../../cableTvSingleTopUp',
                            type: 'POST',
                            dataType: "json",
                            data: {responseJSON:response,paymentReference:paymentReference,gateway:'monnify',ref_id:ref_id},
                            success:function(result){
                                console.log(result)
                                // if(result.ResultCode === "00"){
                                    window.location.href = '/cabletv/success/'+result.MerchantReference
                                // }
    
                            }
                        });

                        
                    }
                },
                onClose: function(response){

                }
            });
        }, 
        error: function(response){
            console.log(response)
            swal('Oops', 'Service currently not available', 'error');
        }
    });
}

function SubscribeCableTVWithMonnifyTransfer(ref_id){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../getCableTvDetails',
        type: 'POST',
        data:{paymentGateWay:'monnify', ref_id:ref_id},
        success:function(res){
            let response = JSON.parse(res);
            console.log(response);
            MonnifySDK.initialize({
                amount: parseInt(response.totalAmountToPayTransfer),
                currency: "NGN",
                reference: ref_id,
                customerName: response.customerName,
                customerEmail: response.customerEmail,
                customerMobileNumber: response.customerPhone,
                apiKey: response.monnify_api_key,
                contractCode: response.monnify_contract_code,
                paymentDescription: "CABLE TV SUBSCRIPTION" ,
                paymentMethods: ["ACCOUNT_TRANSFER"],
                onComplete: function(response){
                    let paymentReference = response.paymentReference
                    if (response.responseCode !== "USER_CANCELLED") {
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: '../../cableTvSingleTopUp',
                            type: 'POST',
                            dataType: "json",
                            data: {responseJSON:response,paymentReference:paymentReference,gateway:'monnify',ref_id:ref_id},
                            success:function(result){
                                console.log(result)
                                // if(result.ResultCode === "00"){
                                    window.location.href = '/cabletv/success/'+result.MerchantReference
                                // }
    
                            }
                        });

                        
                    }
                },
                onClose: function(response){

                }
            });
        }, 
        error: function(response){
            console.log(response)
            swal('Oops', 'Service currently not available', 'error');
        }
    });
}

function getStartimesBouquets(evt){
    let cardNumber = evt.value;
    let opt = "";
    if (cardNumber.length >= 11){
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            url: '../getStartimesBouquets',
            type: 'POST',
            dataType: "json",
            data:{cardNumber:cardNumber},
            success:function(response){
                console.log(response)
                if (typeof response.msg !== 'undefined') {
                    swal('Oops', response.msg[0], 'error');
                    $('#package').html(
                      "<option> -- SELECT BOUQUET --</option>"
                    );
                }else{
                    for (let i = 0; i < response.code.length; i++){
                        opt += '<option value='+response.code[i]+'>'+response.diaplay_name[i]+'</option>'
                    }
                }
                $('#package').html(opt);
            }
        })
    }
}

function getPriceVariationStartimes(evt){
    console.log(evt.value);
    document.getElementById('bouquet_name').value=evt.options[evt.selectedIndex].text
    let options = "";
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../getStartimesVariationPriceGuest',
        type:'GET',
        dataType: 'json',
        data:{packageCode:evt.value},
        success:function(data){
            // console.log(data);
            let response = JSON.parse(JSON.stringify(data));
            for (let i = 0; i < response.length; i++){
                options += `<option value="${response[i]['amount']}">${response[i]['display_name']}</option>`
            }
            document.getElementById('bouquet_price').innerHTML = options
            let valididity = response[0]['display_name']
            let start = valididity.indexOf('(')+1;
            let end = valididity.indexOf(')');
            let validityDays = valididity.substring(start, end)
            document.getElementById('bouquet_validity').value = validityDays

            // console.log(response[0]);
        }
    });

}

function getStartimesBouquetValidity(e){
    let valididity = e.options[e.selectedIndex].text
    let start = valididity.indexOf('(')+1;
    let end = valididity.indexOf(')');
    let validityDays = valididity.substring(start, end)
    document.getElementById('bouquet_validity').value = validityDays
    console.log(validityDays);

}

function payStartimesRechargeWithFlutterwave(){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../getSubscriberRechargeInfoGuest',
        type: 'GET',
        dataType: 'json',
        data: {paymentGateWay: 'monnify'},
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
                        url: '../../rechargeStartimesGuest',
                        type: 'POST',
                        dataType: 'json',
                        data:{details:starResponse, paymentReference:paymentReference, paymentGateWay:'flutter'},
                        success:function(data){
                            console.log(data)
//                            if(data.status === 'success'){
                                window.location.href = '../../cabletv/success/'+data.MerchantReference
  //                          }
                        }
                    })
                },
                customizations: {
                    title: "Recharge Pro",
                    description: "Data top up.",
                    logo: "https://assets.piedpiper.com/logo.png",
                },
            });


        }
    })
}

function payStartimesRechargeWithFlutterwaveGuestNew(){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../getSubscriberRechargeInfoGuestNew',
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
            let tTotal = res.tTotal
            FlutterwaveCheckout({
                public_key: flutter_public_key,
                tx_ref: tx_ref,
                amount: tTotal,
                currency: "NGN",
                country: "NG",
                payment_options: "card",
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
                        url: '../../rechargeStartimesGuestNew',
                        type: 'POST',
                        dataType: 'json',
                        data:{details:starResponse, paymentReference:paymentReference, paymentGateWay:'flutter'},
                        success:function(data){
                            console.log(data)
//                            if(data.status === 'success'){
                               window.location.href = '../../cabletv/success/'+data.MerchantReference
  //                          }
                        }
                    })
                },
                customizations: {
                    title: "Recharge Pro",
                    description: "Startimes Cabletv subscription.",
                    logo: "https://assets.piedpiper.com/logo.png",
                },
            });
        }
    });

}

function payStartimesRechargeWithMonnifyGuestNew(ref_id){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../../getSubscriberRechargeInfoGuestNew',
        type: 'GET',
        dataType: 'json',
        data: {paymentGateWay: 'monnify', ref_id:ref_id},
        success: function (res) {
            console.log(res)
            MonnifySDK.initialize({
                amount: parseInt(res.cardAmount),
                currency: "NGN",
                reference: ref_id,
                customerName: res.loggeInUser,
                customerEmail: res.email,
                customerMobileNumber: res.mobile,
                apiKey: res.monnify_api_key,
                contractCode: res.monnify_contract_code,
                paymentDescription: "STARTIMES BILL PAYMENT" ,
                paymentMethods: ["CARD"],
                onComplete: function(response){
                    let paymentReference = response.paymentReference
                    if (response.responseCode !== "USER_CANCELLED") {
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: '../../../rechargeStartimesGuestNew',
                            type: 'POST',
                            dataType: 'json',
                            data:{paymentReference:paymentReference, paymentGateWay:'monnify',ref_id:ref_id},
                            success:function(data){
                                console.log(data)
                                window.location.href = '../../cabletv/success/'+data.MerchantReference
                            }
                        })
                        
                    }
                    
                },
                onClose: function(data){
                    
                }
            });
        }, 
        error: function (res){
            console.log(res)
        }
    });

}

function payStartimesRechargeWithMonnifyGuestNewTransfer(ref_id){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../../getSubscriberRechargeInfoGuestNew',
        type: 'GET',
        dataType: 'json',
        data: {paymentGateWay: 'monnify', ref_id:ref_id},
        success: function (res) {
            console.log(res)
            MonnifySDK.initialize({
                amount: parseInt(res.transferAmount),
                currency: "NGN",
                reference: ref_id,
                customerName: res.loggeInUser,
                customerEmail: res.email,
                customerMobileNumber: res.mobile,
                apiKey: res.monnify_api_key,
                contractCode: res.monnify_contract_code,
                paymentDescription: "STARTIMES BILL PAYMENT" ,
                paymentMethods: ["ACCOUNT_TRANSFER"],
                onComplete: function(response){
                    let paymentReference = response.paymentReference
                    if (response.responseCode !== "USER_CANCELLED") {
                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                        });
                        $.ajax({
                            url: '../../../rechargeStartimesGuestNew',
                            type: 'POST',
                            dataType: 'json',
                            data:{paymentReference:paymentReference, paymentGateWay:'monnify',ref_id:ref_id},
                            success:function(data){
                                console.log(data)
                                window.location.href = '../../cabletv/success/'+data.MerchantReference
                            }
                        })
                        
                    }
                    
                },
                onClose: function(data){
                    
                }
            });
        }, 
        error: function (res){
            console.log(res)
        }
    });

}

function payPowerWithFlutterWave(){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../powerDetailsGuest',
        type: 'GET',
        dataType: 'json',
        data: {paymentGateWay: 'flutter'},
        success: function (res) {
            console.log(res);
            balanceStats = res.balanceStats
            if(!balanceStats){
                swal('Oops', 'Service currently not available try again later', 'error')
            }else{
                FlutterwaveCheckout({
                    public_key: res.flutter_public_key,
                    tx_ref: res.tx_ref,
                    amount: "1",
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
                            url: '../../buyPowerWithCardGuest',
                            type: 'POST',
                            dataType: 'json',
                            data:{paymentReference:paymentReference, paymentGateWay:'flutter'},
                            success:function(data){
                                console.log(data);
                                // console.log(data.status)
                                //if(data.status === true){
                                window.location.href="/power/response/"+data.ref;
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
            

        }
    })

}

function payPowerWithMonnify(ref_id){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../../powerDetailsGuest',
        type: 'GET',
        dataType: 'json',
        data: {paymentGateWay: 'monnify',ref_id:ref_id},
        success: function (res) {
            console.log(res);
            balanceStats = res.balanceStats
            if(!balanceStats){
                swal('Oops', 'Service currently not available try again later', 'error')
            }else{
                MonnifySDK.initialize({
                    amount: parseInt(res.monnifyCost),
                    currency: "NGN",
                    reference: ref_id,
                    customerName: res.name,
                    customerEmail: res.email,
                    customerMobileNumber: res.phone,
                    apiKey: res.monnify_api_key,
                    contractCode: res.monnify_contract_code,
                    paymentDescription: "ELECTRICITY PAYMENT" ,
                    paymentMethods: ["CARD"],
                    onComplete: function(response){
                        let paymentReference = response.paymentReference
                        if (response.responseCode !== "USER_CANCELLED") {
                            $.ajaxSetup({
                                headers: {
                                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                }
                            });
                            $.ajax({
                                url: '../../../buyPowerWithCardGuest',
                                type: 'POST',
                                dataType: 'json',
                                data:{paymentReference:paymentReference, paymentGateWay:'monnify', ref_id:ref_id},
                                success:function(data){
                                    console.log(data);
                                    window.location.href="/power/response/"+data.ref;
                                },
                                error: function(res){
                                    console.log(res);
                                    swal('Oops', 'Service currently not available try again later', 'error')
                                }
                            })
                        }
                        
                    },
                    onClose: function(data){
                        
                    }
                });
            }
        },
        error: function (response){
            swal('Oops', 'An Error occured try again later', 'error')
        }
    })

}

function payPowerWithMonnifyTransfer(ref_id){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: '../../../powerDetailsGuest',
        type: 'GET',
        dataType: 'json',
        data: {paymentGateWay: 'monnify',ref_id:ref_id},
        success: function (res) {
            console.log(res);
            balanceStats = res.balanceStats
            if(!balanceStats){
                swal('Oops', 'Service currently not available try again later', 'error')
            }else{
                MonnifySDK.initialize({
                    amount: parseInt(res.monnifyCost),
                    currency: "NGN",
                    reference: ref_id,
                    customerName: res.name,
                    customerEmail: res.email,
                    customerMobileNumber: res.phone,
                    apiKey: res.monnify_api_key,
                    contractCode: res.monnify_contract_code,
                    paymentDescription: "ELECTRICITY PAYMENT" ,
                    paymentMethods: ["ACCOUNT_TRANSFER"],
                    onComplete: function(response){
                        let paymentReference = response.paymentReference
                        if (response.responseCode !== "USER_CANCELLED") {
                            $.ajaxSetup({
                                headers: {
                                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                }
                            });
                            $.ajax({
                                url: '../../../buyPowerWithCardGuest',
                                type: 'POST',
                                dataType: 'json',
                                data:{paymentReference:paymentReference, paymentGateWay:'monnify', ref_id:ref_id},
                                success:function(data){
                                    console.log(data);
                                    window.location.href="/power/response/"+data.ref;
                                },
                                error: function(res){
                                    console.log(res);
                                    swal('Oops', 'Service currently not available try again later', 'error')
                                }
                            })
                        }
                        
                    },
                    onClose: function(data){
                        
                    }
                });
            }
        },
        error: function (response){
            swal('Oops', 'An Error occured try again later', 'error')
        }
    })
}


function loginAcc(){
    window.location.href="/login"
}


