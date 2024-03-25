// Play audio

const aplayer = document.querySelector("#aplayer");

if (aplayer) {
  let dataSong = JSON.parse(aplayer.getAttribute("data-song"));
  let dataSinger = JSON.parse(aplayer.getAttribute("data-singer"));
  const ap = new APlayer({
    container: aplayer,
    audio: [
      {
        name: dataSong.title,
        artist: dataSinger.fullName,
        url: dataSong.audio,
        cover: dataSong.avatar,
      },
    ],
    autoplay: true,
  });

  const avatar = document.querySelector(".singer-detail .inner-avatar");
  ap.on("play", function () {
    avatar.style.animationPlayState = "running";
  });

  ap.on("pause", function () {
    avatar.style.animationPlayState = "paused";
  });

  ap.on("ended", function() {
    const link = `/songs/listen/${dataSong._id}`;
    const option = {
      method: "PATCH"
    }

    fetch(link, option)
    .then(res => res.json())
    .then(data => {
      const elementListenSpan = document.querySelector(".singer-detail .inner-listen span");
      elementListenSpan.innerHTML = `${data.listen} views`;
    })
  })
}

// End play audio

// Button like
const buttonLike = document.querySelector("[button-like]");
if (buttonLike) {
  buttonLike.addEventListener("click", () => {
    const isActive = buttonLike.classList.contains("active");
    const typeLike = isActive ? "no" : "yes";

    const idSong = buttonLike.getAttribute("button-like");
    const link = `/songs/like/${typeLike}/${idSong}`;
    fetch(link, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then((data) => {
        const spanLike = buttonLike.querySelector("[data-like]");
        spanLike.innerHTML = data.like;
        buttonLike.classList.toggle("active");
      });
  });
}
// End Button like

// search suggest
const boxSearch = document.querySelector(".box-search");
if (boxSearch) {
  const input = boxSearch.querySelector("input[name='keyword']");
  const boxSuggest = boxSearch.querySelector(".inner-suggest");
  input.addEventListener("keyup", () => {
    const keyword = input.value;
    console.log(keyword);
    const link = `/search/suggest?keyword=${keyword}`;
    fetch(link)
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          const songs = data.songs;
          if (songs.length > 0) {
            boxSuggest.classList.add("show");
            const htmls = songs.map((song) => {
              // sẽ biến thành mảng
              return `
         <a href="/songs/detail/${song.slug}" class="inner-item">
  <div class="inner-image">
    <img src="${song.avatar}" alt="Song Image">
  </div>
  <div class="inner-info">
    <div class="inner-title">${song.title}</div>
    <div class="inner-singer">
      <i class="fa-solid fa-microphone-lines"></i> ${song.infoSinger.fullName}
    </div>
  </div>
</a>
        `;
            });
            const boxList = boxSuggest.querySelector(".inner-list");
            boxList.innerHTML = htmls.join("");
          } else {
            boxSuggest.classList.remove("show");
          }
        }
      });
  });
}
// search suggest

// Button Favorite
const listButtonFavorite = document.querySelectorAll("[button-favorite]");
if (listButtonFavorite.length > 0) {
  listButtonFavorite.forEach((buttonFavorite) => {
    buttonFavorite.addEventListener("click", () => {
      const isActive = buttonFavorite.classList.contains("active");
      // logic o day la: khi da them mot bai hat vao favorite, nut tym se mau do va class la active, typeFavorite = "no"
      // khi do neu click vao, o controller se fetch mot api de xoa favourite bai hat do, class se la "", typeFavorite se la "yes"
      // con khi chua them favorite, class se la "", typefavorite la "yes", controller se fetch api de tao mot collection favorite moi
      const typeFavorite = isActive ? "no" : "yes";
      const idSong = buttonFavorite.getAttribute("button-favorite");
      const link = `/songs/favorite/${typeFavorite}/${idSong}`;
      fetch(link, {
        method: "PATCH",
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          buttonFavorite.classList.toggle("active");
        });
    });
  });
}
// End Button Favorite
