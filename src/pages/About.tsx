import AboutBio from '../components/about/AboutBio'
import AboutSkills from '../components/about/AboutSkills'
import AboutExperience from '../components/about/AboutExperience'

export default function About() {
    return (
        <div className="relative w-full">
            <AboutBio />
            <AboutSkills />
            <AboutExperience />
        </div>
    )
}
