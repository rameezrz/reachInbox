# ReachInbox

![Landing Page](https://ovq37ygrsuppsjg2.public.blob.vercel-storage.com/ReachInbox_Landingpage)
[Frontend Repository Link](https://github.com/rameezrz/reachInboxFrontend) (Seperate)

ReachInbox is a full-stack application designed to manage emails and categorize them based on the content. It integrates with Gmail and Outlook, allowing users to fetch, analyze, categorize, and respond to emails automatically..

## Features

- **OAuth Integration :** Supports OAuth2.0 authentication with Gmail and Outlook.
- **Email Fetching :** Retrieves emails from the user's inbox.
- **Email Analysis :** Analyzes email content and categorizes it into predefined labels.
- **Automatic Response :** Sends predefined responses based on email categories.

## Tech Stack

- **Frontend :** React
- **Backend :** Node.js, Express
- **Database :** MySQL
- **Email APIs :** Gmail API, Microsoft Graph API
- **Authentication :** OAuth2.0

## Setup

##### Prerequisites

- Nodejs
- MySQL
- Google Developer Account
- Microsoft Azure Account

##### Installation

1. Clone the Repository

```sh
git clone https://github.com/yourusername/reachinbox.git
cd reachinbox
```

2. Install Dependencies

```sh
npm install
```

3. Environment Variables
   Create a .env file in the root directory and add the following environment variables:

```sh
PORT=3000
OPENAI_API_KEY=your_openai_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_google_redirect_uri
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
MICROSOFT_REDIRECT_URI=your_microsoft_redirect_uri
DATABASE_URL=mysql_local_uri
```

4. Run the Application

```sh
npm run dev
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs, improvements, or new features.

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

**Free Software, Hell Yeah!**

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax"
[dill]: https://github.com/joemccann/dillinger
[git-repo-url]: https://github.com/joemccann/dillinger.git
[john gruber]: http://daringfireball.net
[df1]: http://daringfireball.net/projects/markdown/
[markdown-it]: https://github.com/markdown-it/markdown-it
[Ace Editor]: http://ace.ajax.org
[node.js]: http://nodejs.org
[Twitter Bootstrap]: http://twitter.github.com/bootstrap/
[jQuery]: http://jquery.com
[@tjholowaychuk]: http://twitter.com/tjholowaychuk
[express]: http://expressjs.com
[AngularJS]: http://angularjs.org
[Gulp]: http://gulpjs.com
[PlDb]: https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md
[PlGh]: https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md
[PlGd]: https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md
[PlOd]: https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md
[PlMe]: https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md
[PlGa]: https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md
