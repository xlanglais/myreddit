
var RowReddit = function(obj,number) {
    this.obj          = obj;

    this.number       = number;
    this.author       = obj.author;
    this.authorurl    = "http://www.reddit.com/user/" + obj.author;
    this.commentsnbr  = obj.num_comments;
    this.commentsurl  = "http://www.reddit.com/" + obj.permalink;
    this.domain       = obj.domain;
    this.exturl       = obj.url;
    this.subrdt       = "/r/" + obj.subreddit;
    this.subrdturl    = "http://www.reddit.com/r/" + obj.subreddit + "/";
    this.subtime      = obj.created_utc;
    this.thumbnail    = obj.thumbnail;
    this.timeago      = timeSince(this.subtime);
    this.title        = obj.title;
    this.user         = obj.user;
    this.votes        = obj.score;
};

var App = function() {
    this.rows = [];
    this.indexStart = 1;
    this.tag = "hot";

    // update time remaining every second, page every minute
    this.timeRemaining = 60;
    this.timer = setInterval(timerCallback, 1000);

    this.tabSelected = 0;
    let t = parseInt(localStorage.getItem("myRedditTabSelected"));
    if (t) {
        this.tabSelected = t;
    }

    this.subredditList = [ "all", "funny", "gaming", "news", "worldnews" ];
    t = localStorage.getItem("myRedditSubredditList");
    if (t) {
        this.subredditList = t.split(" ");
    }

    this.subredditSelected = "all";
    t = localStorage.getItem("myRedditSubredditSelected");
    if (t) {
        this.subredditSelected = t;
    }

    this.topicSelected = "all";
    t = localStorage.getItem("myRedditTopicSelected");
    if (t) {
        this.topicSelected = t;
    }

    this.offsetScroll = 0;
    this.indexSlideshow = 1;
};

var app = null;


function timerCallback() {
    document.getElementById("timeremaining").innerHTML = "Next Update in: " + this.app.timeRemaining + " seconds";

    window.app.timeRemaining--;
    if(window.app.timeRemaining===-1) {
       this.callServer();
    }
}

function showTab(evt, tabName) {
    let i, index=0, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
        if (tablinks[i].innerHTML === evt.currentTarget.innerHTML) {
            index = i;
        }
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    localStorage.setItem("myRedditTabSelected", index);
}

function plusSlides(n) {
    showSlide(window.app.indexSlideshow += n);
}

function showSlide(n) {
    var i;
    var slides = document.getElementsByClassName("slides");
    var dots = document.getElementsByClassName("slideshowdot");
    if (n > slides.length) {
        window.app.indexSlideshow = 1;
    }
    if (n < 1)
    {
        window.app.indexSlideshow = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[window.app.indexSlideshow-1].style.display = "block";
    //dots[window.app.indexSlideshow-1].className += " active";
}

function deleteChildrenNodes(container) {
    while (container && container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
}

function createText(name) {
    return document.createTextNode(name);
}

function createAnchorText(name,url) {
    let aTag = document.createElement('a');
    aTag.setAttribute('href',url);
    aTag.innerHTML = name;

    return aTag;
}

function createDivText(name,url) {
    let div = document.createElement('div');
    if (url) {
        let aTag = document.createElement('a');
        aTag.setAttribute('href',url);
        aTag.innerHTML = name;
        div.appendChild(aTag);
    }
    else {
        div.appendChild(document.createTextNode(name));
    }

    return div;
}

function createDivImage(name,url,height,width) {
    let div = document.createElement('div');

    let img = null;
    if (name && name.startsWith('http')) {
        img = document.createElement('img');
        img.src = name;
        if (height) {img.style.height=height;}
        if (width) {img.style.width=width;}
    }
    else {
        img = document.createElement('span');
        img.className = 'fa fa-ban fa-5x';
        if (height) {img.style.fontSize=height;}
        //if (width) {img.style.height=width;}
    }

    if (img) {
    }

    if (url) {
        let aTag = document.createElement('a');
        aTag.setAttribute('href',url);
        aTag.setAttribute("src", img);
        aTag.appendChild(img);
        div.appendChild(aTag);
        img = div;
    }
    else {
        div.appendChild(img);
    }

    return div;
}

function createDivDescription(row) {
    let top = document.createElement('div');
    top.style.fontSize = 'small';

    let div = createDivText(row.title,row.exturl);
    div.style.fontSize = 'medium';
    top.appendChild(div);

    top.appendChild( createText('submitted ' + row.timeago + ' by ') );
    top.appendChild( createAnchorText(row.author,row.authorurl) );
    top.appendChild( createText(' in ') );
    top.appendChild( createAnchorText(row.subrdt,row.subrdturl) );
    top.appendChild( createDivText('(' + row.commentsnbr + ' comments)',row.commentsurl) );

    return top;
}

function createTableCellText(name,url) {
    let td = document.createElement('td');
    td.appendChild(createDivText(name,url));

    return td;
}

function createTableCellImage(name,url) {
    let td = document.createElement('td');
    td.appendChild( createDivImage(name,url) );

    return td;
}

function createTableCellDescription(row) {
    let td = document.createElement('td');
    td.appendChild( createDivDescription(row) );

    return td;
}

function createTableRow(row) {
    let tr = document.createElement('tr');
    tr.appendChild( createTableCellText(""+row.number) );
    tr.appendChild( createTableCellText(""+row.votes+'\nvotes') );
    tr.appendChild( createTableCellImage(row.thumbnail,row.exturl) );
    tr.appendChild( createTableCellDescription(row) );

    let table = document.getElementById('reddittable');
    table.appendChild(tr);
}

function createULRow(row) {
    let li = document.createElement('li');

    let div = createDivText(row.number);
    div.style.float = 'left';
    div.style.width = '50px';
    div.style.height = '50px';
    div.style.margin = '8px';
    div.style.textAlign = 'center';
    li.appendChild(div);

    div = createDivText(row.votes+'\nvotes');
    div.style.float = 'left';
    div.style.width = '50px';
    div.style.height = '50px';
    div.style.margin = '8px';
    div.style.textAlign = 'center';
    li.appendChild(div);

    div = createDivImage(row.thumbnail,row.exturl);
    div.style.display = 'inline-block';
    div.style.minWidth = '140px';
    div.style.margin = '8px';
    li.appendChild(div);

    div = createDivDescription(row);
    div.style.display = 'inline-block';
    div.style.verticalAlign = 'top';
    div.style.margin = '8px';
    li.appendChild(div);

    document.getElementById('redditul').appendChild(li);
}

function createDisplayRow(row) {
    let sec = document.createElement('div');
    sec.style.clear = 'both';

    let div = createDivText(row.number);
    div.style.float = 'left';
    div.style.width = '50px';
    div.style.height = '50px';
    div.style.margin = '8px';
    div.style.textAlign = 'center';
    sec.appendChild(div);

    div = createDivText(row.votes+'\nvotes');
    div.style.float = 'left';
    div.style.width = '50px';
    div.style.height = '50px';
    div.style.margin = '8px';
    div.style.textAlign = 'center';
    sec.appendChild(div);

    div = createDivImage(row.thumbnail,row.exturl);
    div.style.display = 'inline-block';
    div.style.minWidth = '140px';
    div.style.margin = '8px';
    sec.appendChild(div);

    div = createDivDescription(row);
    div.style.display = 'inline-block';
    div.style.verticalAlign = 'top';
    div.style.margin = '8px';
    sec.appendChild(div);

    document.getElementById('redditdisplay').appendChild(sec);
}

function createFlexRow(row) {
    let top = document.createElement('div');
    top.style.display = 'flex';
    top.style.display.flexDirection = 'row';

    let div = createDivText(row.number);
    div.style.minWidth = '50px';
    div.style.height = '50px';
    div.style.margin = '8px';
    top.appendChild(div);

    div = createDivText(row.votes);
    div.style.minWidth = '50px';
    div.style.height = '50px';
    div.style.margin = '8px';
    top.appendChild(div);

    div = createDivImage(row.thumbnail,row.exturl);
    div.style.minWidth = '140px';
    top.appendChild(div);

    div = createDivDescription(row);
    div.children[0].style.verticalAlign = 'top';
    div.style.margin = '8px';
    top.appendChild(div);

    document.getElementById('redditflex').appendChild(top);
}

function createFlexTile(row) {
    let top = document.createElement('div');
    //top.style.display = 'flex';
    //top.style.display.flexFlow = 'row wrap';
    top.style.margin = '10px';

    let div = createDivImage(row.thumbnail,row.exturl);
    //div.style.display = 'inline';
    div.style.minWidth = '140px';
    div.style.minHeight = '140px';
    top.appendChild(div);

    div = createDivText(row.title,row.exturl);
    div.style.fontSize = 'small';
    div.style.maxWidth = '140px';
    div.className = 'block-with-text';
    top.appendChild(div);

    document.getElementById('reddittiles').appendChild(top);
}

function createSlideshowImage(row) {
    let top = document.createElement('div');
    top.className = 'slides fade';

    let div = createText(row.number + ' / 25');
    div.className = 'slideshownumbertext';
    top.appendChild(div);

    div = createDivImage(row.thumbnail,row.exturl,'300px');
    if (div.children[0].children[0].tagName === 'SPAN') {
        div.children[0].children[0].style.display = 'block';
        div.children[0].children[0].style.textAlign = 'center';
    }
    else {
        div.children[0].style.display = 'block';
        div.children[0].style.margin = 'auto';
        div.children[0].children[0].style.display = 'block';
        div.children[0].children[0].style.margin = 'auto';
    }
    top.appendChild(div);

    div = createDivDescription(row);
    div.style.marginTop = '10px';
    div.style.textAlign = 'center';
    top.appendChild(div);

    document.getElementById('redditslideshow').appendChild(top);
}

function timeSince(date) {
    var seconds = Math.floor(((new Date().getTime()/1000) - date));

    var interval = Math.floor(seconds / 31536000);

    if (interval >= 1) {
        if(interval == 1) return interval + " year ago";
        else
            return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        if(interval == 1) return interval + " month ago";
        else
            return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        if(interval == 1) return interval + " day ago";
        else
            return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        if(interval == 1) return interval + " hour ago";
        else
            return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        if(interval == 1) return interval + " minute ago";
        else
            return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}

function createSelectOptions() {
    let element = document.getElementById('subreddits');

    deleteChildrenNodes(element);
    for(let i=0; i<window.app.subredditList.length; i++) {
        element.appendChild(new Option(window.app.subredditList[i],window.app.subredditList[i]));
    }
    element.value = window.app.subredditSelected;

    element = document.getElementById('topics');
    element.value = window.app.topicSelected;
}

function addSubreddit() {
    let t = window.prompt("Please enter the new subreddit.","");
    if (t) {
        window.app.subredditSelected = t;
        window.app.subredditList.push(t);
        createSelectOptions();

        let element = document.getElementById('subreddits');
        element.value = t;

        localStorage.setItem("myRedditSubredditList", window.app.subredditList.join(' '));
        callServer();
    }
}

function removeSubreddit() {
    let result = window.confirm("Are you sure you want to delete the current subreddit?");
    if (result) {
        let element = document.getElementById('subreddits');
        if (element.value !== 'all') {
            let index = window.app.subredditList.indexOf(element.value);
            if (index > -1) {
                window.app.subredditList.splice(index, 1);
                localStorage.setItem("myRedditSubredditList", window.app.subredditList.join(' '));
            }

            element.remove(element.selectedIndex);
            element.value = window.app.subredditList[0];

            callServer(true);
        }
    }
}

function removeLocalStorage() {
    localStorage.clear();
}

function callServer(fromSelect) {
    if (fromSelect) {
        window.app.subredditSelected = document.getElementById('subreddits').value;
        window.app.topicSelected = document.getElementById('topics').value;
        window.app.offsetScroll = 0;
        localStorage.setItem("myRedditOffsetScroll", 0);
    }

    createSelectOptions();

    localStorage.setItem("myRedditSubredditList", window.app.subredditList.join(' '));
    localStorage.setItem("myRedditSubredditSelected", window.app.subredditSelected);
    localStorage.setItem("myRedditTopicSelected", window.app.topicSelected);

    window.app.timeRemaining = 60;

    let url =
        "https://www.reddit.com/" +
        (window.app.subredditSelected === 'all' ? '' : 'r/' + window.app.subredditSelected + '/' ) +
        (window.app.topicSelected === 'all' ? '' : window.app.topicSelected) +
        ".json";
    console.log("Server call: " + url);

    $.getJSON(url, function(data) {
        let container;
        container = document.getElementById('reddittable');
        deleteChildrenNodes(container);
        container = document.getElementById('redditul');
        deleteChildrenNodes(container);
        container = document.getElementById('redditdisplay');
        deleteChildrenNodes(container);
        container = document.getElementById('redditflex');
        deleteChildrenNodes(container);
        container = document.getElementById('reddittiles');
        deleteChildrenNodes(container);
        container = document.getElementById('redditslideshow');
        deleteChildrenNodes(container);

        window.app.rows = [];

        // fill UIs
        var listing = data.data.children;
        for(var i=0, l=listing.length; i<l; i++) {
            var obj = listing[i].data;
            let row = new RowReddit(obj,i+1);
            window.app.rows.push(row);
            createTableRow(row);
            createULRow(row);
            createDisplayRow(row);
            createFlexRow(row);
            createFlexTile(row);
            createSlideshowImage(row);
        }
        showSlide(1);

        window.app.offsetScroll = localStorage.getItem("myRedditOffsetScroll");
        if(!window.app.offsetScroll) {
            window.app.offsetScroll = 0;
        }
        window.scrollTo(0, window.app.offsetScroll);
    })
        .done(function() {
            //console.log( "second success" );
        })
        .fail(function() {
            console.log( "error" );
        })
        .always(function() {
            //console.log( "complete" );
        });
}

function init() {
    console.log("init");

    if(!window.app) {
        window.app = new App();
    }

    document.getElementsByClassName('nav')[0].children[window.app.tabSelected].children[0].click();

    callServer();
}

function unload() {
    //localStorage.setItem("myRedditSubredditList", window.app.subredditList.join(' '));
}

function scrolling() {
    localStorage.setItem("myRedditOffsetScroll", window.pageYOffset);
}
