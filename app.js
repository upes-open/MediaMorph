// Open the modal
document.getElementById("openModal").addEventListener("click", function() {
  document.getElementById("myModal").style.display = "block";
});

// Close the modal when the user clicks on the close button or outside the modal
document.addEventListener("click", function(event) {
  var modal = document.getElementById("myModal");
  if (
    event.target == modal ||
    event.target.classList.contains("close")
  ) {
    modal.style.display = "none";
  }
});

// Close the modal when the user presses the Escape key
document.addEventListener("keydown", function(event) {
  var modal = document.getElementById("myModal");
  if (event.key === "Escape" && modal.style.display === "block") {
    modal.style.display = "none";
  }
});
var volumeSlider = document.getElementById("volumeSlider");
var volumePercentage = document.getElementById("volumePercentage");

volumeSlider.addEventListener("input", function() {
  var percentage = volumeSlider.value + "%";
  volumePercentage.textContent = percentage;
});
