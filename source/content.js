var options;
chrome.extension.sendRequest({}, function(response) {
	setAllTheSettings(response);
});

function setAllTheSettings(response) {
	options = response;
	// Handling the old true/false strings in options
	for(var key in options) {
		if(options.hasOwnProperty(key)) {
			if(options[key] == "true") options[key] = true;
			if(options[key] == "false") options[key] = false;
		}
	}
	bodyClasses = document.body.classList;
	doneTheStuff = false;
	document.body.addEventListener("DOMNodeInserted", eventDispatcher);
	if(options.circled_avatars == true) {
		bodyClasses.add("btd-circle-avatars");
	}
	if(options.reduced_padding == true) {
		bodyClasses.add("btd-reduced-padding");
	}
	if(options.no_columns_icons == true) {
		bodyClasses.add("btd-no-columns-icons");
	}
	if(options.grayscale_notification_icons == true) {
		bodyClasses.add("btd-grayscale-notification-icons");
	}
	if(options.only_one_thumbnails == true) {
		bodyClasses.add("btd-one-thumbnail");
	}
	if(options.blurred_modals) {
		bodyClasses.add("btd-blurred-modals");
	}

	if(options.small_icons_compose) {
		bodyClasses.add("btd-small-icons-compose");
	}
}

String.prototype._contains = function(word) {
	return this.indexOf(word) != -1;
}

window.document.onkeydown = function(e) {
	var openModal = document.getElementById("open-modal");
	if(openModal.children.length > 0 && e.keyCode == 27) {
		openModal.innerHTML = "";
		openModal.style.display = "none";
	}
}

// @author James Padolsey
// @url http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
// This function creates a new anchor element and uses location
// properties (inherent) to get the desired URL data. Some String
// operations are used (to normalize results across browsers).
 
function parseURL(url) {
    var a =  document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function(){
            var ret = {},
                seg = a.search.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
}


function modalWorker() {
	if(options.timestamp != "relative") {
		if(typeof event.target.querySelector === "function") {
			timeIsNotRelative(event.target.querySelector("time > *"), options.timestamp);
		}
	}

	if(options.url_redirection == true){
		useFullUrl(event.target);
	}

	if(typeof event.target.querySelectorAll === "function") {
		nameDisplay(event.target.querySelectorAll("a[rel='user']:not(.item-img)"), options.name_display);
	}
}

// Emojitify an element thanks to emojiToImage.js
function emojiInElement(el) {
	el.innerHTML = emoji.imageReplace(el.innerHTML);
	el.classList.add("emoji");
}

function eventDispatcher() {
	function mediaPreviewSize() {
		for (var i = document.querySelectorAll(".js-column[data-column]").length - 1; i >= 0; i--) {
			var col = document.querySelectorAll(".js-column[data-column]")[i];
			var columnSize = TD.storage.columnController.get(col.getAttribute("data-column")).getMediaPreviewSize();
			col.setAttribute("data-media-preview-size",columnSize);
		};
	}

	function findColumn(childObj) {
	    var testObj = childObj.parentNode;
	    var count = 1;
	    while(!testObj.classList.contains("js-column")) {
	        testObj = testObj.parentNode;
	        count++;
	    }
	    return testObj;
	}

	// Change data-media-preview-size when small/medium/large are clicked
	for (var i = 0; i < document.querySelectorAll(".column a[data-value]:not(.is-selected)").length; i++) {
		document.querySelectorAll(".column a[data-value]:not(.is-selected)")[i].addEventListener("click", function() {
			findColumn(event.target).setAttribute("data-media-preview-size",event.target.parentNode.getAttribute("data-value"));
		});
	};

	// If the event.target is the text (TweetDeck updates timestamp at regular intervals) then we can get the .txt-mute element and tweak it in real-time
	if((event.relatedNode.className != undefined && event.relatedNode.className._contains("txt-mute")) && options.timestamp != "relative") {
		timeIsNotRelative(event.relatedNode, options.timestamp);
	} 
	// If it's not a .txt-mute element, it must be a tweet or something similar, let's check it !
	else if(event.target.className && event.target.className._contains("stream-item")) {

		if(document.querySelectorAll(".js-column").length > 0) {
			if(!doneTheStuff) {
				doneTheStuff = true;
				injectScript(mediaPreviewSize);
				var openModal = document.getElementById("open-modal");
				openModal.addEventListener("DOMNodeInserted", modalWorker);
				var modals = document.querySelectorAll(".js-modals-container, #actions-modal");
				for (var i = modals.length - 1; i >= 0; i--) {
				modals[i].addEventListener("DOMNodeInserted", function() {
					document.body.classList.add("btd-modal-opened");
					if(openModal.children.length > 0) {
						openModal.innerHTML = "";
						openModal.style.display = "none";
					}
				});
				modals[i].addEventListener("DOMNodeRemoved", function() {
					document.body.classList.remove("btd-modal-opened");
				});
				};
			}
		}
		// Applying the timestamp
		if(options.timestamp != "relative") {
			if(event.target.querySelector("time")){
				timeIsNotRelative(event.target.querySelector("time > *"), options.timestamp);
			}
		}

		// Tweaking the name displaying
		nameDisplay(event.target.querySelectorAll("a[rel='user']:not(.item-img)"), options.name_display);
		
		// If asked, removing t.co links
		if(options.url_redirection == true){
			useFullUrl(event.target);
		}

		// If asked, creating the non-pic.twitter image previews
		var links = event.target.querySelectorAll("p > a[data-full-url]");
		if(links.length > 0) {
		var linkToHandle = links[links.length-1];
		var isDetail = linkToHandle.parentNode.parentNode.querySelectorAll(".js-cards-container").length != 0;
		var imgURL = linkToHandle.getAttribute("data-full-url");
			if(!isDetail) {
				if((imgURL._contains("imgur.com/") && !imgURL._contains("/?q")) && options.img_preview_imgur){
					createPreviewDiv(linkToHandle,"imgur");
				} else if(imgURL._contains("d.pr/i") && options.img_preview_droplr) {
					createPreviewDiv(linkToHandle,"droplr");
				} else if(imgURL._contains("cl.ly/") && options.img_preview_cloud) {
					createPreviewDiv(linkToHandle,"cloudApp");
				} else if(imgURL._contains("instagram.com/") && options.img_preview_instagram) {
					createPreviewDiv(linkToHandle,"instagram");
				} else if((imgURL._contains("flic.kr/") || imgURL._contains("flickr.com/")) && options.img_preview_flickr){
					createPreviewDiv(linkToHandle,"flickr")
				} else if(imgURL._contains("500px.com/") && options.img_preview_500px) {
					createPreviewDiv(linkToHandle,"fivehundredpx");
				} else if((imgURL._contains("media.tumblr.com/") && !imgURL._contains("tumblr_inline")) && options.img_preview_tumblr) {
					createPreviewDiv(linkToHandle,"tumblr");
				} else if(new RegExp("vimeo.com\/[0-9]*$").test(imgURL) && options.img_preview_vimeo) {
					createPreviewDiv(linkToHandle,"vimeo");
				} else if(imgURL._contains("dailymotion.com/video/") && options.img_preview_dailymotion) {
					createPreviewDiv(linkToHandle,"dailymotion");
				} else if(new RegExp("(deviantart.com\/art|fav.me|sta.sh)").test(imgURL) && options.img_preview_deviantart) {
					createPreviewDiv(linkToHandle,"deviantart");
				} else if(imgURL._contains("img.ly") && options.img_preview_imgly) {
					createPreviewDiv(linkToHandle,"img.ly");
				} else if(new RegExp("(dribbble.com\/shots|drbl.in)").test(imgURL) && options.img_preview_dribbble) {
					createPreviewDiv(linkToHandle,"dribbble");
				} else if(imgURL._contains("yfrog.com") && options.img_preview_yfrog) {
					createPreviewDiv(linkToHandle,"yfrog")
				} else if(imgURL._contains("moby.to/") && options.img_preview_mobyto) {
					createPreviewDiv(linkToHandle,"mobyto");
				} else if(imgURL._contains("soundcloud.com/") && options.img_preview_soundcloud) {
					createPreviewDiv(linkToHandle,"soundcloud");
				} else {
					emojiInElement(event.target.querySelector("p.js-tweet-text"));
				}
			}
		} else {
			emojiInElement(event.target.querySelector("p.js-tweet-text"));
		}
		}

		if(options.yt_rm_button) {
			var preview = event.target.querySelectorAll("div.video-overlay.icon-with-bg-round");

			if(preview != null) {
				for (var i = preview.length - 1; i >= 0; i--) {
					preview[i].remove();
				};
			}
		}

	} else if(event.relatedNode.classList != undefined && event.relatedNode.classList.contains("typeahead")) {
		if(options.typeahead_display_username_only == true) {
			for (var i = event.relatedNode.querySelectorAll("strong.fullname").length - 1; i >= 0; i--) {
				event.relatedNode.querySelectorAll("strong.fullname")[i].remove();
			};
			for (var i = event.relatedNode.querySelectorAll("span.username").length - 1; i >= 0; i--) {
				event.relatedNode.querySelectorAll("span.username")[i].style.fontWeight= "bold";
				event.relatedNode.querySelectorAll("span.username")[i].classList.add("fullname");
				event.relatedNode.querySelectorAll("span.username")[i].classList.remove("username");
			};
		}
	} else if(event.relatedNode.id == "actions-modal") {
		event.target.style.height = "auto";
		event.target.style.width = "550px";
	} else if(event.relatedNode.id == "open-modal" && options.blurred_modals) {
		var openModal = document.getElementById("open-modal");
		if(event.relatedNode.querySelector(".js-mediatable") != undefined) {
			document.body.classList.add("btd-modal-opened");
			var blurredDismiss = document.createElement("div");
			blurredDismiss.classList.add("btd-blurred-dismiss");
			document.querySelector(".js-modal-panel a[rel='dismiss']").insertAdjacentElement("beforebegin", blurredDismiss);
			document.querySelector(".js-embeditem.med-embeditem").insertAdjacentElement("afterbegin",blurredDismiss);
			for (var i = openModal.querySelectorAll("a[rel=dismiss], #btd-modal-dismiss, .btd-blurred-dismiss").length - 1; i >= 0; i--) {
				openModal.querySelectorAll("a[rel=dismiss], #btd-modal-dismiss, .btd-blurred-dismiss")[i].addEventListener("click", function() {
					openModal.style.display = "none";
					openModal.innerHTML = "";
					document.querySelector("body").classList.remove("btd-modal-opened");
				});
			};
			openModal.querySelector("#open-modal .js-mediatable").addEventListener("DOMNodeRemoved", function() {
					if(event.relatedNode.id == "open-modal") {
						document.querySelector("body").classList.remove("btd-modal-opened");
					}
				});
		} else {
			document.body.classList.add("btd-modal-opened");
			if(openModal.querySelector("#open-modal .js-modal-panel") != undefined) {
				openModal.querySelector("#open-modal .js-modal-panel:not(.binded)").addEventListener("DOMNodeRemoved", function() {
					if(event.relatedNode.id == "open-modal") {
						document.querySelector("body").classList.remove("btd-modal-opened");
					}
				});
			}
		}
		
	}
		setTimeout(function() {
		for (var i = document.querySelectorAll("p.js-tweet-text:not(.emoji)").length - 1; i >= 0; i--) {
			emojiInElement(document.querySelectorAll("p.js-tweet-text:not(.emoji)")[i]);
			document.querySelectorAll("p.js-tweet-text:not(.emoji)")[i].classList.add("emoji");	
		};
		},0);
}

function createPreviewDiv(element, provider) {
	function findColumn(childObj) {
	    var testObj = childObj.parentNode;
	    var count = 1;
	    while(testObj.classList && !testObj.classList.contains("js-column")) {
	        testObj = testObj.parentNode;
	        count++;
	    }
	    // now you have the object you are looking for - do something with it
	    return testObj;
	}
	// Getting the full URL for later
	var linkURL = element.getAttribute("data-full-url");
	if(typeof findColumn(element).getAttribute === "function") {
		if(!findColumn(element).classList.contains("column-temp")) {
			var thumbSize = findColumn(element).getAttribute("data-media-preview-size");
		} else {
			var thumbSize = "medium";
		}
	}
	if(new RegExp("large|medium|small").test(thumbSize)) {
		if(provider == "imgur") {
			// Settings up some client-ID to "bypass" the request rate limite (12,500 req/day/client)
			var imgurClientIDs = ["c189a7be5a7a313","180ce538ef0dc41"];
			function getClientID() {
				return imgurClientIDs[Math.floor(Math.random() * imgurClientIDs.length)];
			}
			// Setting the right suffix depending of the user's option
			switch(thumbSize) {
				case "small":
					suffixImgur = "t"
					break;
				case "medium":
					suffixImgur = "m"
					break;
				case "large":
					suffixImgur = "l"
					break;
			}
			var imgurID = parseURL(linkURL).segments.pop();
			// Album
			if(linkURL._contains("imgur.com/a/")) {
				previewFromAnAlbum(imgurID);
			} else if(linkURL._contains("imgur.com/gallery/")) {
				$.ajax({
					// Sidenote, even if Imgur got different models for album and gallery, they share the same API url so, why bother ?
					url: "https://api.imgur.com/3/gallery/image/"+imgurID,
					type: 'GET',
					dataType: 'json',
					// Plz don't steal this data, anyone can create an Imgur app so be fair !
					headers: {"Authorization": "Client-ID "+getClientID()}
				})
				.done(function(data) {
					// Gallery/image
					var thumbnailUrl = "https://i.imgur.com/"+data.data.id+suffixImgur+".jpg";
					continueCreatingThePreview(thumbnailUrl,thumbnailUrl.replace(/[a-z].jpg/,".jpg"));
				})
				.fail(function() {
					// Gallery/Album
					console.log("Better TweetDeck: Gallery isn't a image!");
					previewFromAnAlbum(imgurID,"https://imgur.com/a/"+imgurID+"/embed");
				});
			} else {
				// Single image
				var imgurID = parseURL(linkURL).file.split(".").shift();
				continueCreatingThePreview("https://i.imgur.com/"+imgurID+suffixImgur+".jpg","https://i.imgur.com/"+imgurID+".jpg");
			}

			function previewFromAnAlbum(albumID) {
				$.ajax({
					// Sidenote, even if Imgur got different models for album and gallery, they share the same API url so, why bother ?
					url: "https://api.imgur.com/3/album/"+albumID,
					type: 'GET',
					dataType: 'json',
					// Plz don't steal this data, anyone can create an Imgur app so be fair !
					headers: {"Authorization": "Client-ID "+getClientID()}
				})
				.done(function(data) {
					// Make the thumbnail URL with suffix and the ID of the first images in the album/gallery
					var thumbnailUrl = "https://i.imgur.com/"+data.data.cover+suffixImgur+".jpg";
					continueCreatingThePreview(thumbnailUrl,"https://imgur.com/a/"+albumID+"/embed",true);
				});
			}
		} else if(provider == "droplr") {
			// Depending of the thumbSize option we're getting d.pr/i/1234/small or d.pr/i/1234/medium (it seems like Droplr hasn't a "large" option)
			if(thumbSize == "small") {
				var suffixDroplr = thumbSize;
			} else {
				var suffixDroplr = "medium";
			}
			// Removing the last "/" if present and adding one+suffix
			var thumbnailUrl = linkURL.replace(/\/$/,"");
			var thumbnailUrl = thumbnailUrl+"/"+suffixDroplr;
			continueCreatingThePreview(thumbnailUrl, linkURL+"+");
		} else if(provider == "cloudApp") {
			$.ajax({
				url: linkURL,
				type: 'GET',
				dataType: 'json',
				headers: {"Accept": "application/json"}
			})
			.done(function(data) {
				if(data.item_type == "image"){
					var thumbnailUrl = data.thumbnail_url;
					continueCreatingThePreview(thumbnailUrl, data.content_url);
				}
			});
		} else if(provider == "instagram") {
			var instagramID = parseURL(linkURL.replace(/\/$/,"")).segments.pop();
			switch(thumbSize) {
				case "small":
					suffixInstagram = "t"
					break;
				case "medium":
					suffixInstagram = "m"
					break;
				case "large":
					suffixInstagram = "l"
					break;
			}
			$.ajax({
				url: "http://api.instagram.com/oembed?url="+linkURL
			})
			.done(function() {
				continueCreatingThePreview("http://instagr.am/p/"+instagramID+"/media/?size="+suffixInstagram);
			});
			
		} else if(provider == "flickr") {
			if(thumbSize == "large") maxWidth = 800;
			if(thumbSize == "medium") maxWidth = 500;
			if(thumbSize == "small") maxWidth = 300;
			var flickUrl = encodeURIComponent(linkURL);
			$.ajax({
				url: 'https://www.flickr.com/services/oembed/?url='+flickUrl+'&format=json&maxwidth='+maxWidth,
				type: 'GET',
				dataType: "json"
			})
			.done(function(data) {
				continueCreatingThePreview(data.url);
			});
		} else if(provider == "fivehundredpx") {
			var photoID = parseURL(linkURL).segments.pop();
			switch(thumbSize) {
				case "small":
					suffixFiveHundred = "2"
					break;
				case "medium":
					suffixFiveHundred = "3"
					break;
				case "large":
					suffixFiveHundred = "4"
					break;
			}
			$.ajax({
				// Don't steal my consumer key, please !
				url: "https://api.500px.com/v1/photos/"+photoID+"?consumer_key=8EUWGvy6gL8yFLPbuF6A8SvbOIxSlVJzQCdWSGnm",
				type: 'GET',
				dataType: "json"
			})
			.done(function(data) {
				var picURL = data.photo.image_url.replace(/[0-9].jpg$/,suffixFiveHundred+".jpg");
				var fullPicURL = data.photo.image_url;
				continueCreatingThePreview(picURL,fullPicURL);
			});
		} else if(provider == "tumblr") {
			// Using the appropriate suffix depending of the settings
			switch(thumbSize) {
				case "small":
					suffixTumblr = "250"
					break;
				case "medium":
					suffixTumblr = "400"
					break;
				case "large":
					suffixTumblr = "500"
					break;
			}
			// Getting the file extension of the URL for later
			var fileExtension = linkURL.split(".").pop();
			// Getting the original suffix (100,250,400,500)
			var rxp = new RegExp(/[0-9]*.[a-z]*$/);
			var tumblrSize = parseInt(rxp.exec(linkURL)[0].split(".")[0]);
			if(tumblrSize >= suffixTumblr) {
				var smallerThumb = linkURL.replace(tumblrSize+"."+fileExtension,suffixTumblr+"."+fileExtension);
				continueCreatingThePreview(smallerThumb, linkURL);
			} else {
				continueCreatingThePreview(linkURL, linkURL);
			}
		} else if(provider == "vimeo") {
			switch(thumbSize) {
				case "small":
					suffixVimeo = "100"
					break;
				case "medium":
					suffixVimeo = "200"
					break;
				case "large":
					suffixVimeo = "640"
					break;
			}
			var vimeoID = parseURL(linkURL).segments.shift();
			$.ajax({
				url: 'http://vimeo.com/api/oembed.json?url=http%3A//vimeo.com/'+vimeoID,
				type: 'GET',
				dataType: 'json'
			})
			.done(function(data) {
				continueCreatingThePreview(data.thumbnail_url.replace(/_[0-9]*.jpg$/,"_")+suffixVimeo+".jpg",data.html,true);
			});
		} else if(provider == "dailymotion") {
			var dailymotionID = parseURL(linkURL).segments[1];
			if(thumbSize == "large") {
				$.ajax({
					url: 'https://api.dailymotion.com/video/'+dailymotionID+"?fields=thumbnail_480_url,embed_html",
					type: 'GET',
					dataType: 'json'
				})
				.done(function(data) {
					continueCreatingThePreview(data.thumbnail_480_url,data.embed_html.replace("http://","https://"),true);
				});
				
			} else if(thumbSize == "medium") {
				$.ajax({
					url: 'https://api.dailymotion.com/video/'+dailymotionID+"?fields=thumbnail_240_url,embed_html",
					type: 'GET',
					dataType: 'json'
				})
				.done(function(data) {
					continueCreatingThePreview(data.thumbnail_240_url,data.embed_html.replace("http://","https://"),true);
				});
				
			} else if(thumbSize == "small") {
				$.ajax({
					url: 'https://api.dailymotion.com/video/'+dailymotionID+"?fields=thumbnail_180_url,embed_html",
					type: 'GET',
					dataType: 'json'
				})
				.done(function(data) {
					continueCreatingThePreview(data.thumbnail_180_url,data.embed_html.replace("http://","https://"),true);
				});
				
			}
		} else if(provider == "deviantart") {
			var escapedURL = encodeURIComponent(linkURL);
			$.ajax({
				url: 'http://backend.deviantart.com/oembed?url='+escapedURL,
				type: 'GET',
				dataType: 'json'
			})
			.done(function(data) {
				if(data.type == "photo") {
					continueCreatingThePreview(data.thumbnail_url,data.url);
				}
			});
		} else if(provider == "img.ly") {
			var imglyID = parseURL(linkURL).file;
			if(thumbSize == "small") {
				var suffixImgly = "thumb";
			} else {
				var suffixImgly = thumbSize;
			}
			var finalImglyURL = "http://img.ly/show/"+suffixImgly+"/"+imglyID;
			continueCreatingThePreview(finalImglyURL,"http://img.ly/show/full/"+imglyID);
		} else if(provider == "dribbble") {
			var dribbbleID = parseURL(linkURL).file.split("-").shift();
			$.ajax({
				url: 'http://api.dribbble.com/shots/'+dribbbleID
			})
			.done(function(data) {
				continueCreatingThePreview(data.image_teaser_url,data.image_url);
			});
		} else if(provider == "yfrog") {
			var hashYfrog = parseURL(linkURL).file;
			switch(thumbSize) {
				case "small":
					suffixYfrog = "small";
					break;
				case "medium":
					suffixYfrog = "iphone";
					break;
				case "large":
					suffixYfrog = "medium";
					break;
			}
			continueCreatingThePreview("http://yfrog.com/"+hashYfrog+":"+suffixYfrog,"http://yfrog.com/"+hashYfrog+":medium");
		} else if(provider == "mobyto") {
			var mobyID = parseURL(linkURL).file;
			switch(thumbSize) {
				case "small":
					sizeMobyto = "thumbnail"
					break;
				case "medium":
					sizeMobyto = "medium"
					break;
				case "large":
					sizeMobyto = "medium"
					break;
			}
			continueCreatingThePreview("http://moby.to/"+mobyID+":"+sizeMobyto,"http://moby.to/"+mobyID+":full");
		} else if(provider == "soundcloud") {
			$.ajax({
				url: 'http://soundcloud.com/oembed?url='+linkURL,
				dataType: 'json'
			})
			.done(function(data) {
				continueCreatingThePreview(data.thumbnail_url, data.html.replace('width="100%"','width="600"'), true);
			});

		}
	}

	function continueCreatingThePreview(thumbnailUrl, embed, isAnIframe) {
		var fullBleed = "";
		if(thumbSize == "large") {
			marginSuffix = "tm";
			fullBleed = "item-box-full-bleed";
		} else {
			marginSuffix = "vm";
		}
		var linkURL = element.getAttribute("data-full-url");
		// Creating the elements, replicating the same layout as TweetDeck's one
		var previewDiv = document.createElement("div");
		previewDiv.className = "js-media media-preview position-rel btd-preview "+provider+" "+fullBleed;

		var previewDivChild = document.createElement("div");
		previewDivChild.className = "js-media-preview-container position-rel margin-"+marginSuffix;
		var previewLink = document.createElement("a");
		previewLink.className = "js-media-image-link block med-link media-item media-size-"+thumbSize+"";
		// Little difference, using rel=url otherwhise TweetDeck will treat it as a "real" media preview, therefore "blocking" the click on it 
		previewLink.setAttribute("rel","url");
		previewLink.href = linkURL;
		previewLink.setAttribute("target","_blank");
		previewLink.setAttribute("data-tweetkey",element.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-key"));
		// Applying our thumbnail as a background-image of the preview div
		previewLink.style.backgroundImage = "url("+thumbnailUrl+")";
		previewLink.setAttribute("data-provider",provider);

		if(embed){
			previewLink.setAttribute("data-embed",embed);
		}

		if(isAnIframe) {
			previewLink.setAttribute("data-isembed","true");
		}

		// Constructing our final div
		previewDivChild.appendChild(previewLink);
		previewDiv.appendChild(previewDivChild);

		// Adding it next to the <p> element, just before <footer> in a tweet
		if(thumbSize == "large") {
			var pElement = element.parentNode.parentNode.parentNode.parentNode.querySelector("div.js-tweet.tweet");
		} else {
			var pElement = element.parentNode.parentNode.querySelector("p.js-tweet-text");
		}

		if(pElement) {
			pElement.insertAdjacentElement("afterEnd", previewDiv);
			if(thumbSize == "large") {
				var triangle = document.createElement("span");
				triangle.className = "triangle";
				previewDiv.insertAdjacentElement("beforeEnd",triangle);
			}
		}

		createLightboxes();
		if(document.querySelectorAll(".btd-preview + .js-media.media-preview, .btd-preview + .item-box-full-bleed")) {
			for (var i = document.querySelectorAll(".btd-preview + .js-media.media-preview, .btd-preview + .item-box-full-bleed").length - 1; i >= 0; i--) {
				document.querySelectorAll(".btd-preview + .js-media.media-preview, .btd-preview + .item-box-full-bleed")[i].remove();
			};
		}
		emojiInElement(element.parentNode);
	}

}

function createLightboxes() {
	var noLightboxYet = document.querySelectorAll("section[class*=column-type] .btd-preview a:not(.lightbox-enabled)");
	for (var i = noLightboxYet.length - 1; i >= 0; i--) {
		noLightboxYet[i].addEventListener("click", lightboxFromTweet);
		noLightboxYet[i].classList.add("lightbox-enabled");
		noLightboxYet[i].setAttribute("rel","");
	};
}

// Okay it's probably ugly because it's not very "flexible" but it's the only way I found to replicate the lightboxes efficiently
function lightboxFromTweet() {
	var linkLightbox = event.target, 
	dataEmbed = linkLightbox.getAttribute("data-embed"),
	dataIsEmbed = linkLightbox.getAttribute("data-isembed"),
	dataProvider = linkLightbox.getAttribute("data-provider"),
	dataTweetKey = linkLightbox.getAttribute("data-tweetkey");

	openModal = document.getElementById("open-modal");
	openModal.innerHTML = '<div id="btd-modal-dismiss"></div><div class="js-mediatable ovl-block is-inverted-light"><div class="s-padded"><div class="js-modal-panel mdl s-full med-fullpanel"><a href="#" class="mdl-dismiss js-dismiss mdl-dismiss-media" rel="dismiss"><i class="icon icon-close"></i></a><div class="js-embeditem med-embeditem"><div class="l-table"><div class="l-cell"><div class="med-tray js-mediaembed"></div></div></div></div><div id="media-gallery-tray"></div><div class="js-media-tweet med-tweet"></div></div></div>';
	// Looking at the thumbnail provider
	if(dataProvider == "instagram") {
		$.ajax({
			url: 'http://api.instagram.com/oembed?url='+linkLightbox.href,
			type: 'GET',
			dataType: 'json'
		})
		.done(function(data) {
			// Thank you Instagram for not giving an accurate "type" value depending of the actual type of the object.
			if(data.url._contains(".mp4")) {
				var instaVideo = '<video class="instagram-video" width="400" height="400" controls><source src='+data.url+' type="video/mp4"></video>';
				openModal.querySelector(".js-mediaembed").innerHTML = instaVideo+'<a class="med-origlink" href='+linkLightbox.href+' rel="url" target="_blank">View original</a><a class="js-media-flag-nsfw med-flaglink " href="#">Flag media</a><a class="js-media-flagged-nsfw med-flaglink is-hidden" href="https://support.twitter.com/articles/20069937" rel="url" target="_blank">Flagged (learn more)</a>';
				finishTheLightbox(dataTweetKey);
			} else {
				openModal.querySelector(".js-mediaembed").innerHTML = '<div class="js-media-preview-container position-rel margin-vm"> <a class="js-media-image-link block med-link media-item" rel="mediaPreview" target="_blank"> <img class="media-img" src='+data.url+' alt="Media preview"></a></div><a class="med-origlink" rel="url" href='+linkLightbox.href+' target="_blank">View original</a><a class="js-media-flag-nsfw med-flaglink " href="#">Flag media</a><a class="js-media-flagged-nsfw med-flaglink is-hidden" href="https://support.twitter.com/articles/20069937" rel="url" target="_blank">Flagged (learn more)</a>';
				finishTheLightbox(dataTweetKey);
			}
		});
		
	} else if(dataProvider == "imgur" && dataIsEmbed != null) {
		openModal.querySelector(".js-mediaembed").innerHTML = '<iframe class="imgur-album" width="708" height="550" frameborder="0" src='+dataEmbed+'></iframe><a class="med-origlink" href='+linkLightbox.href+' rel="url" target="_blank">View original</a><a class="js-media-flag-nsfw med-flaglink " href="#">Flag media</a><a class="js-media-flagged-nsfw med-flaglink is-hidden" href="https://support.twitter.com/articles/20069937" rel="url" target="_blank">Flagged (learn more)</a>';
		finishTheLightbox(dataTweetKey);
	} else if(dataProvider == "flickr") {
		// For now I'm only supporting Flickr photos, I still got to add the video support. But does anyone actually use that ?
		$.ajax({
			url: 'https://www.flickr.com/services/oembed/?url='+linkLightbox.href+'&format=json&maxwidth=1024',
			type: 'GET',
			dataType: "json"
		})
		.done(function(data) {
			openModal.querySelector(".js-mediaembed").innerHTML = '<div class="js-media-preview-container position-rel margin-vm"> <a class="js-media-image-link block med-link media-item" rel="mediaPreview" target="_blank"> <img class="media-img" src='+data.url+' alt="Media preview"></a></div><a class="med-origlink" rel="url" href='+linkLightbox.href+' target="_blank">View original</a><a class="js-media-flag-nsfw med-flaglink " href="#">Flag media</a><a class="js-media-flagged-nsfw med-flaglink is-hidden" href="https://support.twitter.com/articles/20069937" rel="url" target="_blank">Flagged (learn more)</a>';
			finishTheLightbox(dataTweetKey);
		});
	} else {
		// If we already got the embed URL/code
		if(dataEmbed != null) {
			// If we got an embed code
			if(dataIsEmbed != null) {
				openModal.querySelector(".js-mediaembed").innerHTML = dataEmbed+'<a class="med-origlink" href='+linkLightbox.href+' rel="url" target="_blank">View original</a><a class="js-media-flag-nsfw med-flaglink " href="#">Flag media</a><a class="js-media-flagged-nsfw med-flaglink is-hidden" href="https://support.twitter.com/articles/20069937" rel="url" target="_blank">Flagged (learn more)</a>';
				finishTheLightbox(dataTweetKey);
			} else {
				openModal.querySelector(".js-mediaembed").innerHTML = '<div class="js-media-preview-container position-rel margin-vm"> <a class="js-media-image-link block med-link media-item" rel="mediaPreview" target="_blank"> <img class="media-img" src='+dataEmbed+' alt="Media preview"></a></div><a class="med-origlink" rel="url" href='+linkLightbox.href+' target="_blank">View original</a><a class="js-media-flag-nsfw med-flaglink " href="#">Flag media</a><a class="js-media-flagged-nsfw med-flaglink is-hidden" href="https://support.twitter.com/articles/20069937" rel="url" target="_blank">Flagged (learn more)</a>';
				finishTheLightbox(dataTweetKey);
			}
		}
	}
	
	function finishTheLightbox(dataTweetKey) {
		var originalTweet = document.querySelector("[data-key='"+dataTweetKey+"']");
		// Embed/Picture creating
		if(openModal.querySelector(".js-mediaembed :-webkit-any(img, iframe, audio)") != null) {
			openModal.querySelector(".js-mediaembed :-webkit-any(img, iframe, audio)").onload = function() {
				openModal.querySelector(".js-mediaembed :-webkit-any(img, iframe, audio)").style.maxHeight = document.querySelector(".js-embeditem.med-embeditem").offsetHeight-(document.querySelector("a.med-origlink").offsetHeight)-20+"px";
				window.onresize = function() {
					openModal.querySelector(".js-mediaembed :-webkit-any(img, iframe, audio)").style.maxHeight = document.querySelector(".js-embeditem.med-embeditem").offsetHeight-(document.querySelector("a.med-origlink").offsetHeight)-20+"px";
				};
				openModal.querySelector(".med-embeditem").classList.add("is-loaded");
				openModal.querySelector(".med-tray.js-mediaembed").style.opacity = 1;
			}
		} else {
			openModal.querySelector(".med-tray.js-mediaembed").style.opacity = 1;
			openModal.querySelector(".med-embeditem").classList.add("is-loaded");
		}

		// Content tweaking
		if(openModal.querySelector(".instagram-video") != null) {
			openModal.querySelector(".instagram-video").style.height = document.querySelector(".js-embeditem.med-embeditem").offsetHeight-(document.querySelector("a.med-origlink").offsetHeight)-20+"px";
			openModal.querySelector(".instagram-video").style.width = document.querySelector(".js-embeditem.med-embeditem").offsetHeight-(document.querySelector("a.med-origlink").offsetHeight)-20+"px";
		}

		if(document.querySelector("iframe[src*='dailymotion.com']") != null) {
			document.querySelector("iframe[src*='dailymotion.com']").height = document.querySelector("iframe[src*='dailymotion.com']").height*2;
			document.querySelector("iframe[src*='dailymotion.com']").width = document.querySelector("iframe[src*='dailymotion.com']").width*2;
		}
		
		// Tweet "copying"
		openModal.querySelector(".js-media-tweet").innerHTML = originalTweet.innerHTML;

		if(openModal.querySelector(".js-media-tweet .activity-header") != null) {
			openModal.querySelector(".js-media-tweet .activity-header").remove();
		}
		if(openModal.querySelector(".js-media-tweet .feature-customtimelines") != null) {
			openModal.querySelector(".js-media-tweet .feature-customtimelines").remove();
		}
		if(openModal.querySelector(".js-media") != null) {
			openModal.querySelector(".js-media").remove();
		}
		if(openModal.querySelector(".js-tweet-actions.tweet-actions") != null) {
			openModal.querySelector(".js-tweet-actions.tweet-actions").classList.add("is-visible");
		}
		openModal.style.display = "block";
		for (var i = openModal.querySelectorAll("a[rel=dismiss], #btd-modal-dismiss").length - 1; i >= 0; i--) {
			openModal.querySelectorAll("a[rel=dismiss], #btd-modal-dismiss")[i].addEventListener("click", function() {
				openModal.style.display = "none";
				openModal.innerHTML = "";
			});
		};

		// Handling the buttons in tweet footer as intended

		// Favorite button
		openModal.querySelector("a[rel='favorite']").addEventListener("click", function() {
			// Faking the current tweet being favorited
			openModal.querySelector(".js-tweet.tweet").classList.toggle("is-favorite");
			event.target.classList.toggle("anim");
			event.target.classList.toggle("anim-slower");
			event.target.classList.toggle("anim-bounce-in");
			// Triggering click action on the "real" fav button so the tweet gets favorited.
			originalTweet.querySelector("a[rel='favorite']").click();
		});

		// Retweet button
		openModal.querySelector("a[rel='retweet']").addEventListener("click", function() {
			// Faking the current tweet being retweeted by triggering the click action on the original button. So tricky, very magic.
			originalTweet.querySelector("a[rel='retweet']").click();
		});

		// Favorite button
		openModal.querySelector("a[rel='reply']").addEventListener("click", function() {
			// Click on the RT button
			originalTweet.querySelector("a[rel='reply']").click();
			// Then click on the "pop-out" button in the inline-reply panel.
			setTimeout(function() {
				originalTweet.querySelector("button.js-inline-compose-pop").click();
				// And click on the dismiss div to close the lightboxe. And BAM ! You're replying to the tweet.
				document.getElementById("btd-modal-dismiss").click();
				originalTweet.querySelector("a[rel='reply']").classList.remove("is-selected");
			}, 0);
		});

		// Menu button
		openModal.querySelector("a[rel='actionsMenu']").addEventListener("click", function() {
			// Faking the current tweet being retweeted by triggering the click action on the original button. So tricky, very magic.
			setTimeout(function() {
				originalTweet.querySelector("a[rel='actionsMenu']").click();
			}, 0);
			// console.log(originalTweet.querySelector("a[rel='actionsMenu']"));
			setTimeout(function() {
				var originalMenu = originalTweet.querySelector(".dropdown-menu");
				originalMenu.classList.add("pos-t");
				openModal.querySelector("a[rel='actionsMenu']").insertAdjacentElement("afterEnd", originalMenu);
			}, 0);
			setTimeout(function() {
				for (var i = openModal.querySelectorAll("a[data-action='message'],a[data-action='mention']").length - 1; i >= 0; i--) {
					openModal.querySelectorAll("a[data-action='message'],a[data-action='mention']")[i].addEventListener("click", function() {
						openModal.style.display = "none";
						openModal.innerHTML = "";
					})
				};
			}, 0);
		});
	}
}

function timeIsNotRelative(element, mode) {
	if(element != null) {
		// Getting the timestamp of an item
		d = element.parentNode.getAttribute("data-time");
		// Creating a Date object with it
		td = new Date(parseInt(d));
		if(options.full_after_24h == true) {
			now = new Date();
			difference = now - td;
		    var msPerMinute = 60 * 1000;
		    var msPerHour = msPerMinute * 60;
		    var msPerDay = msPerHour * 24;
		}

		// Creating year/day/month/minutes/hours variables and applying the lead zeros if necessary
		var year = td.getFullYear();
		if(year < 10) year = "0"+year;
		var month = td.getMonth()+1;
		if(month < 10) month = "0"+month;
		var minutes = td.getMinutes();
		if(minutes < 10) minutes = "0"+minutes;
		var hours = td.getHours();
		if(hours < 10) hours = "0"+hours;
		var day = td.getDate();
		if(day < 10) day = "0"+day;

		var dateString;
		// Handling "US" date format
		if(options.full_after_24h == true && difference < msPerDay) {
			dateString = hours+":"+minutes;
		} else {
			if(mode == "absolute_us"){
				dateString =  month+"/"+day+"/"+year+" "+hours+":"+minutes;
			} else {
				dateString =  day+"/"+month+"/"+year+" "+hours+":"+minutes;
			}
		}
		// Changing the content of the "time > a" element with the absolute time
		element.innerHTML = dateString;
		element.classList.add("txt-mute");
	}
}

function nameDisplay(elements, mode) {
	if(mode == "username"){
		// If we just want the @username.
		for (var i = elements.length - 1; i >= 0; i--) {
			// If the username is NOT in a tweet (typically in a <p> element), do the thing
			if(elements[i].parentNode.tagName != "P") {
				// Removing "http://twitter.com" and the last "/" in the link to get the @username
				var username = elements[i].getAttribute("href").replace(/http(|s):\/\/twitter.com\//,"").replace(/\//g,"");

				// Placing the username in b.fullname if found or in span.username
				if(elements[i].querySelector("b.fullname")){
					elements[i].querySelector("b.fullname").innerHTML = username;
				} else {
					elements[i].innerHTML = username;
				}
				if(elements[i].querySelector("span.username")){
					elements[i].querySelector("span.username").remove();
				}
			}
		};
	} else if(mode == "fullname") {
		// If we just want the fullname, basically we exterminate the usernames
		for (var i = document.querySelectorAll(".username").length - 1; i >= 0; i--) {
		// Ignoring the elements argument because I'm lazy and it works so, hey ?
		document.querySelectorAll(".username")[i].remove();
		};
	} else if(mode == "inverted") {
		// If we want the @username AND the full name, we'll have to swap them
		for (var i = elements.length - 1; i >= 0; i--) {
			// If the username is NOT in a tweet (typically in a <p> element), do the thing
			if(elements[i].parentNode.tagName != "P") {
				// Removing "http://twitter.com" and the last "/" in the link to get the @username
				var username = elements[i].getAttribute("href").split("/").pop();
				if(elements[i].querySelector("b.fullname")) {
					var fullname = elements[i].querySelector("b.fullname").innerHTML;
				}
				if(elements[i].querySelector("span.username")) {
					elements[i].querySelector("span.username span.at").remove();
					// Don't ask me why, I have to apply the fullname twice in order to this to work
					elements[i].querySelector("span.username").innerHTML = fullname;
					elements[i].querySelector("span.username").innerHTML = fullname;
					if(elements[i].querySelector("b.fullname")) {
						elements[i].querySelector("b.fullname").innerHTML = username;
					} else {
						elements[i].innerHTML = username;

					}
				} else {
					elements[i].innerHTML = username;
					if(elements[i].classList.contains('account-link')) {
						elements[i].style.fontWeight = "bold";
					}
				}
				
			}
		};
	}
}

function useFullUrl(element) {
	if(typeof element.querySelector === "function") {
		// Pretty easy, getting the data-full-url content and applying it as href in the links. Bye bye t.co !
		var links = element.querySelectorAll("a[data-full-url]");
		for (var i = links.length - 1; i >= 0; i--) {
			fullLink = links[i].getAttribute("data-full-url");
			links[i].href = fullLink;
		};
	}
}