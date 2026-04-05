const iconElements = document.querySelectorAll(".icon-toggle");

iconElements.forEach((iconElement) => {
  // Find the counter that belongs to this specific heart.
  // HTML structure: <button><i class="icon-toggle"/></button> <span class="like-counter">0</span>
  const button = iconElement.closest("button");
  const counter = button.parentElement.querySelector(".like-counter");
  let likes = 0;

  iconElement.addEventListener("click", function () {
    if (iconElement.classList.contains("bi-heart")) {
      iconElement.classList.remove("bi-heart");
      iconElement.classList.add("bi-heart-fill", "heart-fill");
      likes += 1;
    } else if (iconElement.classList.contains("bi-heart-fill")) {
      iconElement.classList.remove("bi-heart-fill", "heart-fill");
      iconElement.classList.add("bi-heart");
      likes -= 1;
    }
    counter.textContent = likes;
  });
});