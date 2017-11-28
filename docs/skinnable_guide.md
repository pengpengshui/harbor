When user want to change the harbor project skin, we provide a setting json which found in the app folder to change project`s appearance easily, the json file will be read when the project is compiled.

There are serval parameters, which are:
	headerBgColor:  the background color about the header part , format value is #004a70 or RGB shape,
	headerLogo:  the logo image in header, format value is  "images/headerLogo.png",
	loginBgImg: the login page background image at the top-right position. format value is "images/loginBgImg.jpg",
	appTitle: the title above the login form in login page ,
	projects: contain some text information like company name, project name, project version and project introduction which used in the module.


The custom images in the images folder or anywhere , just make sure the relative path is  correct.  these values can also null, even no keys. when no values, project will use origin values.
