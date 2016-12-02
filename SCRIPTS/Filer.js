	// IS FILE API SUPPORTED?

		//Usefull (Don't tell me off for using prototype)
		String.prototype.replaceAll = function(search, replacement) {
			var target = this;
			return target.split(search).join(replacement);
		};

		//define scripts stuff
		scripts = {};

		function useProps(name,author,version,description,person) {
			if (author != "" && author != undefined){scripts[person+'-author'] = author;}
			if (version != "" && version != undefined){scripts[person+'-version'] = version;}
			if (description != "" && description != undefined){scripts[person+'-description'] = description;}
			if (name != "" && name != undefined){document.getElementById(person+"-title").innerHTML = name.replaceAll("_","&nbsp;");;}
			if (description != "" && description != undefined){document.getElementById(person+"-desc").innerHTML = "<span style='color: grey;'>"+author.replaceAll("_","&nbsp;")+"</span><br>"+description.replaceAll("\n","<br>");}
		}

		function gotContents(contents, person) {
			script = contents;
			name = "";
			author = "";
			version = "";
			description = "";

			nameReg = /@name\s(\S+)/i;
			authorReg = /@author\s(\S+)/i;
			versionReg = /@version\s(\S+)/i;
			descriptionReg = /@desc(?:ription)?\s*\n([\s\S]*)@desc(?:ription)?(?:end)?/im;
			scriptReg = /@(?:script|bot)?\s*\n([\s\S]*)@(?:script|bot)?(?:end)?/im;

			if (nameReg.test(contents)) {
				nameReg.test(contents);
				var matchA = nameReg.exec(contents);
				name = matchA[1];
			}

			if (authorReg.test(contents)) {
				authorReg.test(contents);
				var matchA = authorReg.exec(contents);
				author = matchA[1];
			}

			if (versionReg.test(contents)) {
				versionReg.test(contents);
				var matchA = versionReg.exec(contents);
				version = matchA[1];
			}

			if (descriptionReg.test(contents)) {
				descriptionReg.test(contents);
				var matchA = descriptionReg.exec(contents);
				description = matchA[1];
			}

			if (scriptReg.test(contents)) {
				scriptReg.test(contents);
				var matchA = scriptReg.exec(contents);
				script = matchA[1];
			}

			set_scripts(person, script)
			useProps(name,author,version,description,person);
		}



		if (window.File && window.FileReader && window.FileList && window.Blob) {
			function readSingleFile1(evt) {
				//READ FIRST FILE OF EVENT
				var f = evt.target.files[0];

				if (f) {
				  var r = new FileReader();
				  r.onload = function(e) {
						var contents = e.target.result;
						gotContents(contents, "left");
				  }
				  r.readAsText(f);
				} else {
				  alert("Failed to load file");
				}
			}

			function readSingleFile2(evt) {
				//READ FIRST FILE OF EVENT
				var f = evt.target.files[0];

				if (f) {
				  var r = new FileReader();
				  r.onload = function(e) {
						var contents = e.target.result;
						gotContents(contents, "right");
				  }
				  r.readAsText(f);
				} else {
				  alert("Failed to load file");
				}
			}

			if (document.getElementById('left-input'))
				document.getElementById('left-input').addEventListener('change', readSingleFile1, false);
			if (document.getElementById('right-input'))
				document.getElementById('right-input').addEventListener('change', readSingleFile2, false);
		}
		else
		{
		  alert("The File APIs are not fully supported by your browser.");
		}

		function download(filename, text) {
		  var element = document.createElement('a');
		  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		  element.setAttribute('download', filename);

		  element.style.display = 'none';
		  document.body.appendChild(element);

		  element.click();

		  document.body.removeChild(element);
		}

		function exportScript(person) {
			var script = get_scripts(person)
			download(name+".hex", script);
		}
