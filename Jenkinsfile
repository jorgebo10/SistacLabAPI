stage('Commit') {

    node {
        git url: 'https://github.com/jorgebo10/SistacLabAPI.git', branch:'development'

        withDockerContainer(image: 'jorgebo10/node-grunt') {
            sh 'npm install'
            sh 'grunt unittest'
            sh 'grunt compress'

            publishHTML([allowMissing: false, 
              	alwaysLinkToLastBuild: false, 
              	keepAll: false, 
            	reportDir: 'coverage/lcov-report', 
            	reportFiles: 'index.html', 
	      	reportName: 'HTML Report'])
	}
    	
	def server = Artifactory.server "Artifactory"

    	// Create the upload spec.
    	def uploadSpec = """{
        	"files": [
                	{
                    	"pattern": "dist/sistacLabAPI-${env.BUILD_TAG}.zip",
                    	"target": "libs-snapshot-local"
                	}
            ]
        }"""

    	// Upload to Artifactory.
    	def buildInfo1 = server.upload spec: uploadSpec
    }
}
