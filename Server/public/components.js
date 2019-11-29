fetch("components/sidebar.html")
    .then(response => {
        return response.text()
    })
    .then(data => {
        document.getElementById("sidebar").innerHTML = data;
    })