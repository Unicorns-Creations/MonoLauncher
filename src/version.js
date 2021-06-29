function fetchUpdates() {
    var url = "https://raw.githubusercontent.com/Unicorns-Creations/publicFiles/main/monolauncher-changelog.json"

    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (obj) {
        
        const html = obj.changeLogs.map(feed => {
            return `<li>${feed}</li>`
        })
        .join('')
        .replaceAll('UPDATE - ', `<span class="badge bg-warning">Update</span> `)

        document.getElementById("changes").innerHTML = "";

        document
        .querySelector("#changes")
        .insertAdjacentHTML("beforeend", html)

        const authors = obj.versionAuthors.map(names => {
            return names
        })
        .join(", ")

        document.getElementById("authors").innerHTML = ""
        document.querySelector("#authors").insertAdjacentHTML("beforeend", authors)

        document.getElementById("title").innerText = `${obj.name} - Version ${obj.version}`
    })
    .catch(function (error) {              
        Swal.fire({
          title: `Problem occurred!`,
          html: error,
          icon: "error"
        })
    })

  }

  fetchUpdates()