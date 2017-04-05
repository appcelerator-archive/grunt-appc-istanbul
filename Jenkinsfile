@Library('pipeline-library')
import com.axway.AppcCLI;

timestamps {
  node('(osx || linux) && git && npm-publish') {
    def packageVersion = ''
    stage('Checkout') {
      checkout scm
      def packageJSON = jsonParse(readFile('package.json'))
      packageVersion = packageJSON['version']
      currentBuild.displayName = "#${packageVersion}-${currentBuild.number}"
    }

    def isPR = env.BRANCH_NAME.startsWith('PR-')
    // By default, publish any builds not on a PR
    def publish = !isPR
    def tagGit = !isPR

    def appc = new AppcCLI(steps)
    appc.environment = 'preprod'

    nodejs(nodeJSInstallationName: 'node 6.9.5') {
      ansiColor('xterm') {

        stage('Dependencies') {
          appc.install()
          sh 'npm install'
          appc.loggedIn {
            sh 'appc install'
          }
        }

        stage('Build') {
          timeout(10) {
            appc.loggedIn {
              sh 'npm test'
            }
          } // timeout
          junit 'junit_report.xml'
        }

        stage('Publish') {
          if (tagGit) {
            pushGitTag(name: packageVersion, message: "See ${env.BUILD_URL} for more information.", force: true)
          }
          if (publish) {
            sh 'npm publish'
          }
        }
      } // ansiColor
    } // nodejs
  } // node
} // timestamps
