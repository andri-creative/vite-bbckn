import Hero from '../components/Hero'
import Portfolio from '../components/Portfolio'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Experience from '../components/Experience'
import Certificates from '../components/Certificates'
import ContactCTA from '../components/ContactCTA'
import { useState } from 'react'

export default function Home() {
    const [scrollLocked, setScrollLocked] = useState(true)

    const handleScrollDown = () => {
        setScrollLocked(false)
        setTimeout(() => {
            const nextSec = document.getElementById('next-section')
            nextSec?.scrollIntoView({ behavior: 'smooth' })
        }, 50)
    }

    return (
        <div
            className={`relative flex flex-col w-full ${scrollLocked
                    ? ""
                    : "h-auto overflow-y-visible"
                }`}
            style={
                scrollLocked
                    ? { height: '100vh', overflow: 'hidden' }
                    : {}
            }
        >
            {/* 1. Hero — Intro full viewport */}
            <div className="w-full shrink-0">
                <Hero onScrollDown={handleScrollDown} />
            </div>

            {/* 2. About / Portfolio — Bio & profile */}
            <div id="next-section" className="w-full shrink-0">
                <Portfolio />
            </div>

            {/* 3. Skills — Tech stack grid */}
            <div className="w-full shrink-0">
                <Skills />
            </div>

            {/* 4. Projects — Featured work */}
            <div className="w-full shrink-0">
                <Projects />
            </div>

            {/* 5. Experience — Work timeline */}
            <div className="w-full shrink-0">
                <Experience />
            </div>

            {/* 6. Certificates — Credentials */}
            <div className="w-full shrink-0">
                <Certificates />
            </div>

            {/* 7. Contact CTA — Closing section */}
            <div className="w-full shrink-0">
                <ContactCTA />
            </div>
        </div>
    )
}