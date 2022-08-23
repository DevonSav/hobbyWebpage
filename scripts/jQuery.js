// Runs when document loaded
$(function(){

    // Hides section when clicking the button
    $("#articles_hide_section_btn").click(function(){
        $("#saved-article-header").fadeToggle(600); // Hide after short delay
    });

    // Hides section when clicking the button
    $("#images_hide_section_btn").click(function(){
        $("#saved-image-header").fadeToggle(600);
    });

    $(".navigation-bar").animate({left: "150px"}).animate({left: '',right: "30px"}, 500);   // Gives the navbar a little animation when the page loads

    let mode = false;
    $('.dropdown-toggle').click(function(){
        $(this).next('.dropdown').slideToggle('fast');  // Get the next 'dropdown' class and slide it

        mode = !mode;   // Switch between active and not
        if (mode){
            $("#contact-type-nav").css('margin-bottom','120px') // Add space to move submit button down
        } else{
            $("#contact-type-nav").css('margin-bottom','5px')   // Reset space to move button back up
        }

    });

    // Gives illusion of having selected an item
    // Would need to be changed if actual functionality was being added
    $('.dropdown li p').click(function(){
        $('.dropdown-toggle').next('.dropdown').slideToggle('fast');
        mode = !mode;
        if (mode){
            $("#contact-type-nav").css('margin-bottom','120px')
        } else{
            $("#contact-type-nav").css('margin-bottom','5px')
        }
    });

});