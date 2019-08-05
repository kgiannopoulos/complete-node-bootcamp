const fs = require('fs');
const superagent = require('superagent');

const readFilePro = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) reject('I could not find the file');
            resolve(data);
        })
    })
}

const writeFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, err => {
            if (err) reject('Could not write file');
            resolve('success');
        });
    });
};

const getDocPic = async () => {
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(`Breed, ${data}`);

        const res1Pro =  superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res2Pro =  superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res3Pro =  superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        //console.log(res.body.message);

        const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
        const imgs = all.map(el => el.body.message);
        await writeFilePro('dog-img.txt', imgs.join('\n'));
        console.log(all);

        console.log(imgs)

        console.log('Random dog image saved to file');
    } catch (err) {
        console.log(err);
        throw(err)
    }
    return '2: ready!';
};
(async () => {
try{
    console.log('1: will get doc pics!');
    const x = await getDocPic();
    console.log(x);
    console.log('3. Done getting pics');
} catch (err) {
    console.log('ERROR');
}
})();

// console.log('1: will get doc pics!');
// getDocPic().then(x => {
//     console.log(x);
//     console.log('3. Done getting pics');
// }).catch(err => {
//     console.log('ERROR');
//
// });


// readFilePro(`${__dirname}/dog.txt`).then(data =>{
//     console.log(`Breed, ${data}`);
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
//     }).then(res => {
//             console.log(res.body.message);
//         return writeFilePro ('dog-img.txt', res.body.message)
//
//         }).then(() => {
//             console.log('Random dog image saved to file');
//         })
//         .catch(err => {
//             console.log(err);
//         });

