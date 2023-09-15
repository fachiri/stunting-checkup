const path = require('path');
const { existsSync } = require('fs')
const tf = require('@tensorflow/tfjs')
const scikitjs = require('scikitjs')
const xlsx = require('xlsx')

scikitjs.setBackend(tf)

const splitData = (obj) => {
  const n = Object.values(obj[0]).length;
  const labels = obj.map(o => Object.values(o).pop()); 
  const attributes = obj.map(o => Object.values(o).slice(0,n-1)) 
  return {labels,attributes}
}

module.exports = {
  decisionTreeClassifier: async (bb, tb, age, jk) => {
    const lr = new scikitjs.DecisionTreeClassifier()
    const split = 0.3
    const fileDataset = readFileDataset()
    const dataset = splitData(fileDataset)

    let [xTrain, xTest, yTrain, yTest] = scikitjs.trainTestSplit(dataset.attributes, dataset.labels, split)

    lr.fit(xTrain, yTrain)
    const result = lr.predict([[age, bb, tb, jk]])
    const accuracy = lr.score(xTest, yTest)
    const proba = lr.predictProba([[age, bb, tb, jk]])

    const predict_result = result[0]
    const predict_accuracy = accuracy
    const predict_proba_x = proba[0][0]
    const predict_proba_y = proba[0][1]

    return { predict_result, predict_accuracy, predict_proba_x, predict_proba_y }
  }
}

const readFileDataset = () => {
  const fullPath = path.join(path.resolve(__dirname, '..'), 'data', 'dataset.xlsx');
  let data = []

  if(existsSync(fullPath)) {
      const workbook = xlsx.readFile(fullPath)
      const sheet_name_list = workbook.SheetNames
      sheet_name_list.forEach( (y) => {
          const worksheet = workbook.Sheets[y];
          let headers = {};
          for(z in worksheet) {
              if(z[0] === '!') continue;
              
              let tt = 0;
              for (let i = 0; i < z.length; i++) {
                  if (!isNaN(z[i])) {
                      tt = i;
                      break;
                  }
              };
              const col = z.substring(0,tt);
              const row = parseInt(z.substring(tt));
              const value = worksheet[z].v;
      
              if(row == 1 && value) {
                  headers[col] = value;
                  continue;
              }
      
              if(!data[row]) data[row]={};
              data[row][headers[col]] = value;
          }
          data.shift();
          data.shift();
      })
  }

  return data
}