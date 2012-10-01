CPresent
--------
A simple, web-based church presentation system

**Please note this has only been tested in the latest Chrome for MacOSX**

Current Status:
alpha

Installation
===========
1. Install nodejs for your OS
2. Install mongodb
3. Create a database called "presentdb"
4. Download and extract zip file of source
5. In the command line run 
```
npm install .
```
6. Run the following code:

```javascript
node ./index.js
```

7. Your done! Navigate to localhost:8080 for the presentation and localhost:8080/desktop.html for the interface.

How-to
======
**Add a song**
Click on the text "Songlist"

**Edit a song**
Hover over the song then click the little pencil

**Delete a song**
Edit the song, then click the "x" next to the song title

**Add a song to the set list**
Click on a song in the song list

**Preview a song**
Click on a song in the set list

**Change presentation background color**
Click on the first square icon on the Preview toolbar

**Change presentation text color**
Click on the second square icon on the Preview toolbar

**Make a song live**
Click the play button next to the "Preview" header

**Show only the background**
Click "Clear"

**Black out the screen**
Click "Black"

**Stop the presentation**
Click "Live"

Setting up a presentation
========================
1. Open the http://localhost:8080/index.html file in your web browser
2. Move it to the screen your projector uses
3. Full screen the web page
4. In another window open http://localhost:8080/desktop.html
