const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://a8d93147-8a38-4c5f-a98d-84199a58a3a6@api.glitch.com/git/orchid-mighty-dreadnought|https://a8d93147-8a38-4c5f-a98d-84199a58a3a6@api.glitch.com/git/jagged-organic-frost|https://a8d93147-8a38-4c5f-a98d-84199a58a3a6@api.glitch.com/git/boulder-discovered-sidecar|https://a8d93147-8a38-4c5f-a98d-84199a58a3a6@api.glitch.com/git/heartbreaking-shadowed-port|https://a8d93147-8a38-4c5f-a98d-84199a58a3a6@api.glitch.com/git/spangle-serious-snail|https://a8d93147-8a38-4c5f-a98d-84199a58a3a6@api.glitch.com/git/right-economic-beard|https://a8d93147-8a38-4c5f-a98d-84199a58a3a6@api.glitch.com/git/billowy-screeching-dolphin|https://a8d93147-8a38-4c5f-a98d-84199a58a3a6@api.glitch.com/git/dramatic-puzzled-provelone|https://a8d93147-8a38-4c5f-a98d-84199a58a3a6@api.glitch.com/git/yummy-pickled-trip|https://a8d93147-8a38-4c5f-a98d-84199a58a3a6@api.glitch.com/git/sweltering-lowly-growth|https://a8d93147-8a38-4c5f-a98d-84199a58a3a6@api.glitch.com/git/quilt-busy-engineer|https://a8d93147-8a38-4c5f-a98d-84199a58a3a6@api.glitch.com/git/hexagonal-rose-ant|https://a8d93147-8a38-4c5f-a98d-84199a58a3a6@api.glitch.com/git/deciduous-ivy-crowd|https://a8d93147-8a38-4c5f-a98d-84199a58a3a6@api.glitch.com/git/fragrant-scrawny-gazelle`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();