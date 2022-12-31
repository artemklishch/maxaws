var query_btn_1 = document.getElementById("query_btn_1");

const sendBt1Query = () => {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "https://aw7z2rzjs2.execute-api.us-east-1.amazonaws.com/dev/compare-yourself"
  );
  xhr.onreadystatechange = function (event) {
    // console.log("event", event);
    // console.log("event.target", event.target);
    console.log("event", event.target.response); // эта функция отрабатывает трижды: перед запросом, в момент загрузки данных и в конце
  };
  xhr.send();
};

query_btn_1.addEventListener("click", sendBt1Query);

const form = document.getElementById("form");
const inputs = document.getElementsByTagName("input");

const onFormSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const dataToSubmit = {};
  for (const pair of formData.entries()) {
    dataToSubmit[pair[0]] = +pair[1];
  }
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "https://aw7z2rzjs2.execute-api.us-east-1.amazonaws.com/dev/compare-yourself"
  );
  xhr.onreadystatechange = function (event) {
    console.log("resp", event.target.response);
    for (const input of inputs) {
      if (input.value) input.value = "";
    }
  };
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "allow");
  xhr.send(JSON.stringify(dataToSubmit));
};
form.addEventListener("submit", onFormSubmit);

const delete_btn = document.getElementById("delete_btn");
const onDelete = (e) => {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "DELETE",
    "https://aw7z2rzjs2.execute-api.us-east-1.amazonaws.com/dev/compare-yourself"
  );
  xhr.onreadystatechange = function (event) {
    console.log("resp", event.target.response);
  };
  xhr.send();
};
delete_btn.addEventListener("click", onDelete);

const getsingle_btn = document.getElementById("getsingle_btn");
const getSingle = (e) => {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://aw7z2rzjs2.execute-api.us-east-1.amazonaws.com/dev/compare-yourself/single"
  );
  xhr.onreadystatechange = function (event) {
    console.log("resp", event.target.response);
  };
  xhr.send();
};
getsingle_btn.addEventListener("click", getSingle);

const getall_btn = document.getElementById("getall_btn");
const onGetAll = (e) => {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://aw7z2rzjs2.execute-api.us-east-1.amazonaws.com/dev/compare-yourself/all"
  );
  xhr.onreadystatechange = function (event) {
    console.log("resp", event.target.response);
  };
  xhr.send();
};
getall_btn.addEventListener("click", onGetAll);






const allow_btn = document.getElementById('allow_btn')
const deny_btn = document.getElementById('deny_btn')

const allowBtnPress = () => {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "https://aw7z2rzjs2.execute-api.us-east-1.amazonaws.com/dev/compare-yourself"
  );
  xhr.onreadystatechange = function (event) {
    console.log("resp", event.target.response);
  };
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "allow");
  xhr.send(JSON.stringify({age: 30, height: 175, income: 200}));
}
const denyBtnPress = () => {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "https://aw7z2rzjs2.execute-api.us-east-1.amazonaws.com/dev/compare-yourself"
  );
  xhr.onreadystatechange = function (event) {
    console.log("resp", event.target.response);
  };
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "deny");
  xhr.send(JSON.stringify({age: 30, height: 175, income: 200}));
}

allow_btn.addEventListener('click', allowBtnPress)
deny_btn.addEventListener('click', denyBtnPress)









// #set($inputRoot = $input.path('$'))
// {
//   "yur_age" : $inputRoot,
// }



// #set($inputRoot = $input.path('$'))
// {
//   "age" : "$inputRoot.age",
//   "height": "$inputRoot.height",
//   "income": "$inputRoot.income",
//   "userId": "$context.authorizer.principalId"
// }




// AUTH
// exports.handler = (event, context, callback) => {
//   const token = event.authorizationToken;
//   // Use token
//   if (token === 'allow') {
//       const policy = genPolicy('allow', event.methodArn);
//       const principalId = 'aflaf78fd7afalnv';
//       const context = {
//           simpleAuth: true
//       };
//       const response = {
//           principalId: principalId,
//           policyDocument: policy,
//           context: context
//       };
//       callback(null, response);
//   } else if (token == 'deny') {
//       const policy = genPolicy('deny', event.methodArn);
//       const principalId = 'aflaf78fd7afalnv';
//       const context = {
//           simpleAuth: true
//       };
//       const response = {
//           principalId: principalId,
//           policyDocument: policy,
//           context: context
//       };
//       callback(null, response);
//   } else {
//       callback('Unauthorized');
//   }
// };

// function genPolicy(effect, resource) {
//   const policy = {};
//   policy.Version = '2012-10-17';
//   policy.Statement = [];
//   const stmt = {};
//   stmt.Action = 'execute-api:Invoke';
//   stmt.Effect = effect;
//   stmt.Resource = resource;
//   policy.Statement.push(stmt);
//   return policy;
// }




// MODEL code
// {
//   "$schema": "http://json-schema.org/draft-04/schema#",
//   "title": "CompareData",
//   "type": "object",
//   "properties": {
//     "age": {"type": "integer"},
//     "height": {"type": "integer"},
//     "income": {"type": "integer"}
//   },
//   "required": ["age", "height", "income"]
// }