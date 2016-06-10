$(document).ready(function() {
    if (sessionStorage.sessionId) {
        //alert(sessionStorage.username);
        app.initialize();
        $.material.init();
        $.material.ripples();
        //alert(sessionStorage.someKey);
        $(document).on('click','td.leadonClick',function(){
            var phone=$(this).children().attr("href");
            window.open(phone, '_system');
        });
        $(".logout").click(function(){

            sessionStorage.clear();
            window.location.href="index.html";
        });
        $(".reload").attr("href", window.location.href);
        $.ajax({
            type: 'GET',
            url: 'http://crm.primehomes.com/index.php?entryPoint=crmAppJson&session_id='+sessionStorage.sessionId+'&user_name='+sessionStorage.username,
            dataType: 'json',
            beforeSend: function() {
                $(".loader").fadeIn("fast");
            },
            success: function(response) {
                var response = $.parseJSON(JSON.stringify(response));
                console.log(JSON.stringify(response));
                $(".loader").fadeOut("slow", function() {
                    var nodeA='';
                    var nodeB='';
                    $.each(response, function(key, value) {

                       
                        if (value.lead_type == 'New') {
                             nodeA =nodeA+'<tr id="' + value.id + '">\
                                <td class="leadonClick"><a href="tel:' + value.phone + '"><i class="material-icons">call</i></a></td>\
                                <td class="leadnoClick">' + value.name + '</td>\
                                <td class="leadnoClick">' + value.status + '</td>\
                                <td class="leadnoClick">' + value.project_name + '</td>\
                              </tr>';
                            

                        } else if(value.lead_type == 'Follow Up'){
                            nodeB =nodeB+'<tr id="' + value.id + '">\
                                <td class="leadonClick"><a href="tel:' + value.phone + '"><i class="material-icons">call</i></a></td>\
                                <td class="leadnoClick">' + value.name + '</td>\
                                <td class="leadnoClick">' + value.status + '</td>\
                                <td class="leadnoClick">' + value.project_name + '</td>\
                              </tr>';
                            
                        }
                        //console.log(node);
                    });
                $("#activityContent #newLeads table tbody").append(nodeA);
                $("#activityContent #followUpLeads table tbody").append(nodeB);
                if(sessionStorage.activeTab)
                {
                    //alert(sessionStorage.activeTab);
                     $('.activityTabs a[href="#'+ sessionStorage.activeTab +'"]').tab('show');
                     //var scrollelem=$('tr#'+sessionStorage.leadId);
                     $('.activityTabs a[href="#'+ sessionStorage.activeTab +'"]').on('shown.bs.tab', function (e) {
                       $("html, body").stop().animate({ scrollTop: $('tr#'+sessionStorage.leadId).offset().top - 220 }, 400,function(){
                        });
                    })
                    
                }
                });

            },
            error: function(jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);
                    $("#fail").snackbar("show");
                }

        });

        $(document).on('click', '#activityContent table tr td.leadnoClick', function() {
            var id = $(this).parent().attr("id");
            //alert(id);
            if (id != null)
            {
                window.location.href = "leadDetail.html?id=" + id;
                var activeTab=$(this).closest('.tab-pane').attr("id");
                sessionStorage.activeTab=activeTab;
                sessionStorage.leadId=id;
            }
        });

        $(window).scroll(function() {
            var height = $(".toolbar").outerHeight();

            if ($(this).scrollTop() > height) {
                //$('.toolbar').slideUp("fast");
                $('.activityTabs').css({
                    "position": "fixed",
                    "top": "0",
                    "z-index": "999"
                });
            } else {
                $('.activityTabs').css({
                    "position": "static"
                });
            }
        });
    } else {
        window.location.href = "index.html";
    }

});