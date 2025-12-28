// Fetch GitHub repositories
async function fetchGitHubRepos() {
    const username = 'Sandwall';
    const container = document.getElementById('projects_container');

    if (!container) {
        console.error('Projects container not found!');
        return;
    }

    console.log('Fetching repos for:', username);

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=6`);

        console.log('Response status:', response.status);

        if (!response.ok)
            throw new Error('Failed to fetch repositories');

        const repos = await response.json();
        console.log('Fetched repos:', repos.length);

        // Filter out forks and sort by stars/updated date
        const filteredRepos = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));

        if (filteredRepos.length === 0) {
            container.innerHTML = '<p>No projects found.</p>';
            return;
        }

        // Clear loading message
        container.innerHTML = '';

        // Create project cards
        filteredRepos.forEach(repo => {
            const projectDiv = document.createElement('div');
            projectDiv.className = 'project_item';

            const title = document.createElement('h2');
            const link = document.createElement('a');
            link.href = repo.html_url;
            link.target = '_blank';
            link.textContent = repo.name;
            title.appendChild(link);

            const description = document.createElement('p');
            description.textContent = repo.description || 'No description available.';

            projectDiv.appendChild(title);
            projectDiv.appendChild(description);
            container.appendChild(projectDiv);
        });

        console.log('Displayed repos:', filteredRepos.length);

    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        container.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
    }
}

document.addEventListener('DOMContentLoaded', fetchGitHubRepos);