import React, {Component} from "react";
import Search from "./Search";
import "./App.css";
//class App extends is a ES6 class, traditionally, we used React.createClass
class App extends Component {
	constructor(props) {
		//Call super(props) only if you want to access this.props inside the constructor. React automatically, set it for you, if you want to access it anywhere else.
		super(props);
		this.toggleInfoBox = this.toggleInfoBox.bind(this);
		//Possible implentation of ES6 fat arrow functions for binding inside an constructor, some people preffer it more, possibly faster load time?
		this.state = {
			// All locations are stored in JSON file, that gives us a neater code here
			locationsList: require("./locations.json"),
		};
	}
	//componentWillMount() is invoked immediately after a component is mounted (inserted into the tree). Initialization that requires DOM nodes should go here. If you need to load data from a remote endpoint, this is a good place to instantiate the network request.	
	componentWillMount() {
		window.initMap = () => this.initMap();
		//Loading google maps asynchronously
		loadGm("https://maps.googleapis.com/maps/api/js?key=AIzaSyDD1twsFgHP_M4HBz5XdNqUyuUcCmqQlX0&v=3&callback=initMap")
	}
	initMap() {
			let mapSetup = document.getElementById("GoogleMaps");
			//adding a "feature" for resizable canvas, it will stay centered on any screen size.			
			function flexibleCanvas() {
				mapSetup.style.width = window.innerWidth + "px";
				// artifical delay so innerHeight is correct
				setTimeout(function() {
					mapSetup.style.height = window.innerHeight + "px";
				}, 0);
			};
			window.onresize = flexibleCanvas;
			// Launching the function
			flexibleCanvas();
			let content = window.google.maps;
			let GoogleMaps = new content.Map(mapSetup, {
		//Centering the map on capital town of Croatia, Zagreb
        center: { lat: 45.814332, lng: 15.982006 },
        zoom: 14,
		styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}],mapTypeControl: true

    });					
		//Because this frequently changes when you change the scope by calling a new function, you can't access the original value by using it. Aliasing it to that allows you still to access the original value of this.     
			let that = this;	
			let locationsList = [];
			let infoBox = new content.InfoWindow({});
			content.event.addListener(infoBox, "on click");
			this.setState({
				map: GoogleMaps,
				infobox: infoBox
			});
			this.state.locationsList.forEach(function(location) {
				let y = location.latitude;
				let x = location.longitude;
				let marker;
				marker = new content.Marker({
					//set the position of the pin
					position: new content.LatLng(y, x),
					map: GoogleMaps,
					title: "Click for more about this location",
					//if you comment this out or delete it you will get the default pin
					icon: "https://imgur.com/PSdTxyj.png",
					animation: content.Animation.DROP
				});
				//This listener allows us to click on any marker and display's the information about the location
				marker.addListener("click", function() {
					that.toggleInfoBox(marker);
				});
				location.marker = marker;
				//This will display the text in our upper left corner, options to choose		
				location.informations = location.name + "  ☛  " + location.definition;
				locationsList.push(location);
			});
			this.setState({
				locationsList: locationsList
			});
			}
			toggleInfoBox(marker) {
				this.state.infobox.open(this.state.map, marker);
				this.setState({
					previousMarker: marker
				});
				marker.setAnimation(window.google.maps.Animation.BOUNCE);
				//Animation and color change inspired by Udacity's project rubric		
				marker.setIcon("https://imgur.com/lOSUq2Z.png");
				setTimeout(function() {
					marker.setAnimation(null);
				}, 750);
				this.state.infobox.setContent("Loading");
				//marker.getPosition() should always return a Promise<LatLng>
				this.state.map.setCenter(marker.getPosition());
				this.markerInformation(marker);
			}
			markerInformation(marker) {
					let lat = marker.getPosition().lat();
					let lng = marker.getPosition().lng();
					//Here we have foursquare API service, it finds information content about the place based on the latitude and longitude of the marker		
					const foursquare = "https://api.foursquare.com/v2/venues/search?client_id=DNEWZ0LMNEASWPNOPUWSCXZSW2XHTIMNUXQYA0NRTTF1OAA1&client_secret=U14ESP3LH0UQOFNZ1VVG3KCI4A0RFJGMZ54G5ITOPHJVBC12&v=20130815&ll=" + lat + "," + lng;
					let that = this;
					fetch(foursquare).then(function(response) {
					response.json().then(function(data) {
					console.log(data);
					//Setting the name, street address and external information about the place
			        that.state.infobox.setContent(`<strong>${data.response.venues[0].name}</strong>` + 
												  `<p><i>${data.response.venues[0].location.formattedAddress[0]}</i></p>` + 
												  '<a href="https://foursquare.com/v/' + data.response.venues[0].id + 
												  '" target="_blank">Find out more on the <i>Foursquare</i> website.</a>');
		             });
	             }).catch(function(error) {that.state.infowindow.setContent("Data can't be loaded!"); });
            }	
	        render() {
                 return ( <div><Search locationsList={this.state.locationsList}
                                       toggleInfoBox={this.toggleInfoBox} />
                          <div id="GoogleMaps"/></div>
    );
  }
}
//When the other function is done, it returns to our original code with some return value. Our original code resumes its execution and can do something with that return value. We refer to this as synchronous execution.
function loadGm(src) {
  let a = document.createElement('script')
  a.async = true
  a.src = src
 //The onerror event is triggered if an error occurs while loading an external file	
  a.onerror = function() {
		document.write("Google Maps load failed!");
	};
  let b = document.getElementsByTagName('script')[0]
  b.parentNode.insertBefore(a, b)
 
}

export default App;
