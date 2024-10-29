document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.querySelector(".stats-cards");

  //return true or false based on a regex
  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid Username");
    }
    return isMatching;
  }

  async function fetchUserDetails(username) {
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;

      const targetUrl = `https://alfa-leetcode-api.onrender.com/userProfile/${username}`;
      const myHeaders = new Headers();
      myHeaders.append("content-type", "application/json");

      const graphql = JSON.stringify({
        query:
          "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
        variables: { username: `${username}` },
      });
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        body: graphql,
      };

      const response = await fetch(targetUrl);

      if (!response) {
        throw new Error("Unable to fetch the User details");
      }
      const parsedData = await response.json();
      console.log("Logging data: ", parsedData);

      displayUserData(parsedData);
    } catch (error) {
      statsContainer.innerHTML = `<p>${error.message}</p>`;
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  function updateProgress(solved, total, label, circle) {
    const progressDegree = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  function displayUserData(parsedData) {
    console.log(parsedData);

    const totalQues = parsedData.totalQuestions;
    const totalEasyQues = parsedData.totalEasy;
    const totalMediumQues = parsedData.totalMedium;
    const totalHardQues = parsedData.totalHard;

    const solvedTotalQues = parsedData.totalSolved;
    const solvedTotalEasyQues = parsedData.easySolved;
    const solvedTotalMediumQues = parsedData.mediumSolved;
    const solvedTotalHardQues = parsedData.hardSolved;

    updateProgress(
      solvedTotalEasyQues,
      totalEasyQues,
      easyLabel,
      easyProgressCircle
    );
    updateProgress(
      solvedTotalMediumQues,
      totalMediumQues,
      mediumLabel,
      mediumProgressCircle
    );
    updateProgress(
      solvedTotalHardQues,
      totalHardQues,
      hardLabel,
      hardProgressCircle
    );

    const cardsData = [
      {
        label: "Overall Submissions",
        value: parsedData.totalSubmissions[0].submissions,
      },
      {
        label: "Overall Easy Submissions",
        value: parsedData.totalSubmissions[1].submissions,
      },
      {
        label: "Overall Medium Submissions",
        value: parsedData.totalSubmissions[2].submissions,
      },
      {
        label: "Overall Hard Submissions",
        value: parsedData.totalSubmissions[3].submissions,
      },
    ];

    console.log("card ka data: ", cardsData);

    cardStatsContainer.innerHTML = cardsData
      .map(
        (data) =>
          `<div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                    </div>`
      )
      .join("");
  }

  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    console.log("logggin username: ", username);
    if (validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});
