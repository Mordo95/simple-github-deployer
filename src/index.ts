import express from 'express';
import {exec} from 'child_process';
import {exit} from 'process';
import {readFileSync, existsSync} from 'fs';
import { ConfigFile, RepositoryInfo } from './types';
import { verifyPayload } from './utils/verify';

const app = express();

// Body as text for verification, limit 10 mb
app.use(express.text({limit: 1024 * 1000 * 10}));

if (!existsSync("config.json")) {
    console.error("No config file defined. Exiting early");
    exit(1);
}

const config: ConfigFile = JSON.parse(readFileSync("config.json", 'utf-8'));
const repos: RepositoryInfo[] = config.repositories;

app.post('/push', (req, res) => {
    const evName = req.header('x-github-event');
    const payload = JSON.parse(req.body);
    const repo = repos.find(x => x.name.toLowerCase() === payload.repository?.full_name?.toLowerCase());

    // Ignore every action besides push
    if (evName !== "push") {
        return res.status(200).send("Ignored");
    }

    // Check if repository is registered
    if (!repo) {
        console.log('a');
        return res.status(404).send("Not here");
    }

    // Verify request hmac
    const verifiedResponse = verifyPayload(req, repo.secret);
    if (verifiedResponse) {
        return res.status(500).send(verifiedResponse);
    }

    // get the master branch & the ref of the push
    let branch = repo.branch;
    if (!branch) {
        branch = payload.repository.master_branch;
    }
    const ref = payload.ref;

    // Check if the ref is the master branch ref
    if (ref === `refs/heads/${branch}`) {
        exec(`git pull`, {cwd: repo.path});
        exec(`${repo.action}`, {cwd: repo.path});
    }

    // return OK
    return res.status(200).send("OK");
})

app.listen(config.port, () => {
    console.log(`Github actions listener running on port ${config.port}`);
})