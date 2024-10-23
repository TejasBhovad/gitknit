import { account } from "./auth";
export async function fetchGithubRepos() {
  try {
    const session = await account.getSession("current");
    const accessToken = session.providerAccessToken;

    const response = await fetch("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    // console.log("ALERT: DATA FETCHED");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const repos = await response.json();

    // Extract only the needed properties from each repository
    return repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      isPrivate: repo.private,
      language: repo.language,
      url: repo.html_url,
      starCount: repo.stargazers_count,
      forkCount: repo.forks_count,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
    }));
  } catch (error) {
    console.error("Failed to fetch GitHub repositories:", error);
    throw error;
  }
}
