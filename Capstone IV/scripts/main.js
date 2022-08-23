var savedImagesArray = [];   // Array of all saved images
var savedArticlesArray = []; // Array of all saved pages
var savedSectionsArray = []; // Array of all saved page sections



/**
 * Designed to run when the page has loaded.
 * Used to initiate all other functions.
 * Checks if it is running for the first time.
 * If it is, initialises the values.
 * Otherwise tries to grab values from session storage.
 * @param {boolean} loadSavedItems Set to true to load items.
 */
function onPageLoad(loadSavedItems = null)
{
    // Check if code has run before using bool check
    if (localStorage.getItem("hasRunBefore") === null)
    {
        // Convert the arrays to JSON for storage
        localStorage.setItem("saved_articles", JSON.stringify(savedArticlesArray));
        localStorage.setItem("saved_sections", JSON.stringify(savedSectionsArray));
        localStorage.setItem("saved_images", JSON.stringify(savedImagesArray));

        localStorage.setItem("hasRunBefore", true); // Set or create a bool so we know it has been done before
    }
    else{
        // Get the items from storage and apply it to the arrays
        savedArticlesArray = JSON.parse(localStorage.getItem("saved_articles"));
        savedSectionsArray = JSON.parse(localStorage.getItem("saved_sections"));
        savedImagesArray = JSON.parse(localStorage.getItem("saved_images"));

        if(loadSavedItems == true)
        {
            let emptyStorageHeader = document.getElementById("empty-storage-header");
            let imageStorageHeader = document.getElementById("saved-image-header");
            let articleStorageHeader = document.getElementById("saved-article-header");
            let otherStorageHeader = document.getElementById("saved-OTHER-header");

            if(savedImagesArray.length != 0){
                emptyStorageHeader.style.display = "none";
                loadImgItemPreviews();
            } else{
                imageStorageHeader.style.display = "none";
            }

            if(savedArticlesArray.length != 0){
                emptyStorageHeader.style.display = "none";
                loadPageItemPreviews();
            } else{
                articleStorageHeader.style.display = "none";
            }

            if(savedSectionsArray.length != 0){
                emptyStorageHeader.style.display = "none";
                // load
            } else{
                otherStorageHeader.style.display = "none";
            }

        }
    }
}



/**
 * Object for holding an image and it's source.
 * @param image Image element to be saved.
 * @param reference Link element to the original page.
 */
function ImageWithDescription(image, reference) {
    this.image = image;
    this.reference = reference;
}


/* NOTE:
Only the last image in a set is saved just due to how the HTML is set up.
This is only the case because button formatting would make it look ugly as it is currently,
with weird gaps between images for the save button(this could be adressed with more time).
Also the image links allow the user to return to the whole set of images regardless.
*/

/**
 * Saves an image and it's source.
 * @param saveButton This items save button.
 * @param {string} imageID The ID of the image to save.
 * @param {string} sourcePage Link to the original page.
 */
function saveImgToLocalStorage(saveButton, imageID, sourcePage = null)
{
    // Get the image element
    let siblingImgElement = getPreviousSibling(saveButton, "#"+imageID) // Find sibling of the button
    let clone = siblingImgElement.cloneNode(true);  // Make a copy
    clone.id = "cloned-"+siblingImgElement.id;      // Set clones ID

    // Get the page link element
    let source = document.createElement("a");   // Create an element

    // Check if link has been manually set
    if(sourcePage == null){
        source.href = window.location.href; // Set the link to the current page URL
    } else{
        source.href = sourcePage;   // Set the element link to the provided url
    }
    source.innerHTML = "Image Source";          // Set the element text
    source.className = "image-source"           // Set class for styling

    //Create a new object
    let newSavedItem = new ImageWithDescription(
        clone.outerHTML,    // Must be the outerHTML as elements can't be stringified.
        source.outerHTML    // Learned this the hard way through trial and error + many console.log()'s
    );

    savedImagesArray.push(newSavedItem);  // Add it to the array
    alert("There are currently " + savedImagesArray.length + " images saved to your storage.\n" + totalItems + " items in total.");
    localStorage.setItem("saved_images", JSON.stringify(savedImagesArray)); // Save to local storage
}


/**
 * Generates page elements for every saved image.
 */
function loadImgItemPreviews()
{
    savedImagesArray = JSON.parse(localStorage.getItem("saved_images"));    // Get array from storage
    let parentElement = document.getElementById("saved-image-header");        // Reference to the root HTML parent (for all saved images)

    for (let i = 0; i < savedImagesArray.length; i++)
    {
        let thisObjectParent = document.createElement("div");   // Create an element to hold the object
        thisObjectParent.className = "saved-image";             // Set class
        parentElement.appendChild(thisObjectParent);            // Append this element to the root parent

        let recreatedImgElement = document.createElement("div");    // Create an element
        thisObjectParent.appendChild(recreatedImgElement);          // Append this element to the parent
        recreatedImgElement.outerHTML = savedImagesArray[i].image;  // Set the element HTML to what was saved

        let recreatedRefElement = document.createElement("div");        // Create an element
        thisObjectParent.appendChild(recreatedRefElement);              // Append this element to the parent
        recreatedRefElement.outerHTML = savedImagesArray[i].reference;  // Set the element HTML to what was saved
    }
}


/**
 * Object for holding a page name and source.
 * @param {string} pageName The original article title.
 * @param {string} reference Link to the original page.
 */
function PageWithLink(pageName, reference) {
    this.pageName = pageName;
    this.reference = reference;
}

/**
 * Saves a page link.
 * @param {string} articleName Optional override for article title.
 * @param {string} articleLink Optional override for link to the original page.
 */
function savePageLink(articleName = null, articleLink = null)
{
    let pageTitle = null;
    let pageLink = null;

    // Check if name has been manually set
    if(articleName == null){
        pageTitle = document.getElementsByTagName("title")[0].innerHTML;    // Get current page title
    } else{
        pageTitle = articleName;
    }

    // Check if link has been manually set
    if(articleLink == null){
        pageLink = window.location.href;    // Get current page URL
    } else{
        pageLink = articleLink;
    }

    //Create a new object
    let newSavedItem = new PageWithLink(
        pageTitle,
        pageLink
    );

    savedArticlesArray.push(newSavedItem);      // Add it to the array

    let totalItems = savedImagesArray.length + savedArticlesArray.length + savedSectionsArray.length;

    alert("There are currently " + savedArticlesArray.length + " articles saved to your storage.\n" + totalItems + " items in total.");
    localStorage.setItem("saved_articles", JSON.stringify(savedArticlesArray)); // Save to local storage
}

/**
 * Generates page elements for every saved article.
 */
function loadPageItemPreviews()
{
    savedArticlesArray = JSON.parse(localStorage.getItem("saved_articles"));    // Get array from storage
    let parentElement = document.getElementById("saved-article-header");        // Reference to the root HTML parent (for all saved pages)

    for (let i = 0; i < savedArticlesArray.length; i++)
    {
        let thisObjectParent = document.createElement("div");   // Create an element to hold the object
        thisObjectParent.className = "saved-page";              // Set class
        parentElement.appendChild(thisObjectParent);            // Append this element to the root parent

        let generatedPageLinkElement = document.createElement("a"); // Create an element
        thisObjectParent.appendChild(generatedPageLinkElement);     // Append this element to the parent
        generatedPageLinkElement.innerHTML = savedArticlesArray[i].pageName;    // Set the element text
        generatedPageLinkElement.href = savedArticlesArray[i].reference;        // Set the element HTML to what was saved
    }
}


/**
 * Gets first sibling above the given element that matches the selector.
 * @param elem The element which will have its siblings checked.
 * @param {string} selector The ID, Class, etc. that the sibling must have.
 */
function getPreviousSibling(elem, selector)
{
	// Get the next sibling element
	var sibling = elem.previousElementSibling;

	// If there's no selector, return the first sibling
	if (!selector){
        return sibling;
    }

	// If the sibling matches our selector, use it
	// If not, jump to the next sibling and continue the loop
	while (sibling)
    {
		if (sibling.matches(selector)){
            return sibling;
        }
		sibling = sibling.previousElementSibling;
	}
};


/**
 * Toggles the button class between 'liked' and 'default'. Also changes button text.
 * @param buttonElement The element that will have its class changed.
 */
function toggleLikeButton(buttonElement)
{
    if (buttonElement.className == "btn-like-default"){
        buttonElement.className = "btn-like-liked";
        buttonElement.innerHTML = "Liked!"
    } else{
        buttonElement.className = "btn-like-default";
        buttonElement.innerHTML = "Like"
    }
}


/**
 * Resets local and session storage for debugging.
 */
function clearAllStorage()
{
    sessionStorage.clear();
    localStorage.clear();
    //console.log("Cleared storage!");
    alert("Cleared storage.\n" + (savedImagesArray.length + savedArticlesArray.length + savedSectionsArray.length) + " items removed!")

}




/* REFERENCES
localStorage: https://www.w3schools.com/jsref/prop_win_localStorage.asp
Get sibling method: https://gomakethings.com/finding-the-next-and-previous-sibling-elements-that-match-a-selector-with-vanilla-js/
Cloning element: https://gomakethings.com/how-to-copy-or-clone-an-element-with-vanilla-js/#:~:text=You%20call%20the%20cloneNode(),of%20it%20var%20clone%20%3D%20elem.
Getting current url: https://www.tutorialrepublic.com/faq/how-to-get-the-current-url-with-javascript.php#:~:text=Answer%3A%20Use%20the%20window.,on%20click%20of%20the%20button.
Getting current page title: Comment by Marcus at https://stackoverflow.com/questions/9228947/how-to-get-current-html-page-title-with-javascript
How to store HTML elements in localStorage: https://stackoverflow.com/questions/71672535/cant-stringify-the-object-that-contains-dom-elements-on-it

Setting up forms: https://www.w3schools.com/html/html_forms.asp
Dropdown menu: https://stackoverflow.com/questions/32099106/how-can-i-create-a-drop-down-menu-with-jquery
*/


/* TASK LIST, IGNORE
Within the entirety of your site, you should have the following JavaScript functionality:

DONE: Create a functional "Save for later" page for your website, where users can earmark articles, images, recipes, etc. in a personal folder to be able to go back and see them later.
DONE(all article sections): Each item/recipe/image, etc. must have the option to "Save for later".
DONE: When an item is added, an alert should tell the user how many items are in their "Save for later" folder.
DONE: Create a new HTML page for the "Save for later" section, which allows the user to see what is in their folder.

DONE: Create a form which allows a user to leave comments.
DONE: Create forms to allow a user to "like" an item/article/etc.
DONE: Create forms for if a person would like to contact you.
(Visual only as functionality not stated to be required)

------
Within the entirety of your site, you should have at least the following jQuery functionality:

DONE: A function which contains hiding/showing.
DONE: A drop-down menu.
DONE: Animation effects.
DONE: A function with chained effects.
*/