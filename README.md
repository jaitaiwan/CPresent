CPresent
--------
A simple, web-based church presentation system

**Please note this has only been tested in the latest Chrome for MacOSX**
Should work in all modern webkit browsers

Current Status:
Release Candidate 4 (Pretty much stable on latest Chrome for mac running server at localhost)

Installation
===========
1. Install nodejs for your OS
2. Install mongodb
3. Create a database called "presentdb" ``` Can be changed in server/config.coffee ```
4. Download and extract zip file of source
5. In the command line run 
```
npm install .
```
6. Run the following code:

```javascript
sudo node ./index.js
```
Note sudo is required to run the application on port 80

7. Your done! Navigate to localhost:80 for the presentation and localhost:80/ui.html for the interface.

Keyboard Shortcuts
======

**Live**

Toggle Fade to Black: ``` b ```

Toggle Fade text out: ``` c ```

Toggle Presentation Live: ``` Ctrl + \ ```

Next Verse ``` Enter ```

Go to verse n ``` 0/1/2/3/4/5/6/7/8/9 ```

Show verse number ``` Alt ```


**Preview**

Show next/previous verse ``` Right/Left ```

Load next/previous song ``` Down/Up ```

Send preview to live ``` Ctrl + l ```

Configuration
=============
You can configure defaults of the application by modifying the values in ```config.coffee```

```port``` Specify which port you'd like to run the server on

```db``` Specify which db you'd like to use for songs

Setting up a presentation
========================
1. Open the http://localhost:80/index.html file in your web browser
2. Move it to the screen your projector uses
3. Full screen the web page
4. In another window open http://localhost:80/ui.html
