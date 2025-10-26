const GITHUB_API = 'https://api.github.com';
const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;
const token = process.env.GITHUB_TOKEN!;

export async function uploadToGithub(
  fileName: string,
  base64Content: string,
  message: string = 'Add new event photo'
) {
  const path = `public/events/${Date.now()}-${fileName}`;
  
  const response = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: base64Content,
        branch: 'main',
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`GitHub API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return {
    url: data.content.download_url,
    path: data.content.path,
    sha: data.content.sha,
  };
}

export async function deleteFromGithub(path: string, sha: string) {
  const response = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Delete event photo',
        sha,
        branch: 'main',
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`GitHub API error: ${JSON.stringify(error)}`);
  }

  return await response.json();
}

export async function listEvents() {
  const response = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/public/events`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  const files = await response.json();
  return files
    .filter((file: any) => file.type === 'file')
    .map((file: any) => ({
      name: file.name,
      url: file.download_url,
      path: file.path,
      sha: file.sha,
    }));
}
