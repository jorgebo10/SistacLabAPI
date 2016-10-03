stage('Commit') {
    node {
        git url: 'https://github.com/jorgebo10/SistacLabAPI.git', branch:'development'
        def nodeHome = tool 'node6.7.0'
        env.PATH="${env.PATH}:${nodeHome}/bin"
        sh 'grunt unittest'
        sh 'grunt compress'
        publishHTML([allowMissing: false, 
            alwaysLinkToLastBuild: false, 
            keepAll: false, 
            reportDir: 'coverage', 
            reportFiles: 'index.html', 
            reportName: 'HTML Report'])
        archive(include: './sistacLabApi-$BUILD_TAG.zip')
    }
}

stage('Acceptance test') {
    node {
          def nodeHome = tool 'node6.7.0'
          env.PATH="${env.PATH}:${nodeHome}/bin"
          sh 'grunt unittest'
          input message: "Does it look good?"
    }
}
