import Link from "next/link";
import {
  Compass,
  ArrowRight,
  Cpu,
  Atom,
  Dna,
  Stethoscope,
  Globe2,
  Calculator,
  Brain,
  Briefcase,
} from "lucide-react";

interface Subfield {
  name: string;
  query: string;
}

interface Domain {
  domain: string;
  icon: typeof Cpu;
  description: string;
  opportunityDiscipline?: string;
  subfields: Subfield[];
}

const TOPIC_DOMAINS: Domain[] = [
  {
    domain: "Psychology & Cognitive Sciences",
    icon: Brain,
    description: "Human cognition, behavioral dynamics, mental health, and computational models of mind.",
    opportunityDiscipline: "Psychology",
    subfields: [
      { name: "Cognitive Psychology", query: "cognitive psychology mental representation" },
      { name: "Clinical & Mental Health", query: "clinical psychology psychopathology intervention" },
      { name: "Social & Personality Psychology", query: "social psychology attitude behavior" },
      { name: "Developmental Psychology", query: "developmental psychology child cognition" },
      { name: "Industrial & Organizational Psychology", query: "industrial organizational psychology workplace" },
      { name: "Neuropsychology & Brain Sciences", query: "neuropsychology fMRI neural mechanisms" },
      { name: "Human-Computer Interaction & AI", query: "human computer interaction cognitive models" },
      { name: "Behavioral Economics & Decision Sciences", query: "behavioral economics decision making heuristics" },
    ],
  },
  {
    domain: "Computer Science & AI",
    icon: Cpu,
    description: "Foundational algorithms, intelligent systems, security, and hardware.",
    opportunityDiscipline: "Artificial Intelligence",
    subfields: [
      { name: "Artificial Intelligence", query: "artificial intelligence" },
      { name: "Machine Learning", query: "machine learning" },
      { name: "Large Language Models", query: "large language models NLP" },
      { name: "Quantum Computing", query: "quantum computing algorithms" },
      { name: "Computer Vision", query: "computer vision object detection" },
      { name: "Cybersecurity & Cryptography", query: "cryptography zero knowledge" },
      { name: "Distributed Systems", query: "distributed systems consensus" },
      { name: "Robotics & Automation", query: "robotics autonomous systems" },
    ],
  },
  {
    domain: "Mathematics & Formal Sciences",
    icon: Calculator,
    description: "Abstract structures, analytical frameworks, and computational theory.",
    opportunityDiscipline: "Mathematics",
    subfields: [
      { name: "Algebra & Number Theory", query: "algebraic geometry number theory" },
      { name: "Probability & Statistics", query: "Bayesian inference stochastic" },
      { name: "Topology & Geometry", query: "differential topology manifold" },
      { name: "Applied Mathematics", query: "partial differential equations dynamical" },
      { name: "Combinatorics & Optimization", query: "combinatorial optimization graph algorithms" },
    ],
  },
  {
    domain: "Physics & Astronomy",
    icon: Atom,
    description: "Fundamental forces, cosmological structures, and matter at all scales.",
    opportunityDiscipline: "Computational Science",
    subfields: [
      { name: "Quantum Mechanics", query: "quantum mechanics entanglement" },
      { name: "Astrophysics & Cosmology", query: "astrophysics gravitational waves" },
      { name: "Condensed Matter Physics", query: "condensed matter superconductivity" },
      { name: "High Energy & Particle Physics", query: "particle physics CERN" },
      { name: "Nuclear Fusion Energy", query: "nuclear fusion tokamak" },
      { name: "Photonics & Optics", query: "nanophotonics metamaterials" },
    ],
  },
  {
    domain: "Biology & Life Sciences",
    icon: Dna,
    description: "Molecular mechanisms, cellular processes, genetics, and ecology.",
    opportunityDiscipline: "Interdisciplinary",
    subfields: [
      { name: "CRISPR & Gene Editing", query: "CRISPR Cas9 base editing" },
      { name: "Genomics & Epigenetics", query: "epigenetics single-cell RNA" },
      { name: "Neuroscience", query: "neuroscience neural circuits" },
      { name: "Synthetic Biology", query: "synthetic biology metabolic engineering" },
      { name: "Structural Biology", query: "protein folding AlphaFold" },
      { name: "Microbiology & Virology", query: "microbiome bacteriophages" },
    ],
  },
  {
    domain: "Medicine & Health Sciences",
    icon: Stethoscope,
    description: "Therapeutics, pathology, immunology, and clinical interventions.",
    opportunityDiscipline: "Psychology",
    subfields: [
      { name: "Immunology & Vaccines", query: "immunology mRNA vaccines" },
      { name: "Oncology & Cancer Research", query: "cancer immunotherapy CAR-T" },
      { name: "Cardiovascular Medicine", query: "cardiology vascular biology" },
      { name: "Neurological Disorders", query: "Alzheimer Parkinson neurodegeneration" },
      { name: "Pharmacology & Drug Discovery", query: "drug discovery small molecules" },
      { name: "Public Health & Epidemiology", query: "epidemiology global health" },
    ],
  },
  {
    domain: "Climate & Environmental Science",
    icon: Globe2,
    description: "Earth systems, biosphere resilience, and sustainability innovations.",
    opportunityDiscipline: "Computational Science",
    subfields: [
      { name: "Climate Modeling & Dynamics", query: "climate modeling carbon cycle" },
      { name: "Renewable Energy Technologies", query: "perovskite solar cells battery" },
      { name: "Biodiversity & Ecology", query: "conservation biology ecosystem" },
      { name: "Oceanography & Marine Sciences", query: "ocean acidification marine biology" },
      { name: "Atmospheric Chemistry", query: "atmospheric chemistry aerosols" },
    ],
  },
];

export const metadata = {
  title: "Topic Explorer — Research Hub",
  description: "Browse scientific fields and discover research papers and academic opportunities across foundational disciplines.",
};

export default function TopicsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <Compass className="w-3.5 h-3.5" />
          <span>Curated Taxonomies & Disciplines</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Scientific Disciplines & Research Topics
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Browse fields and subfields, search live literature, and explore verified academic research
          assistantships, fellowships, and lab positions tailored to your discipline.
        </p>
      </div>

      {/* Domains Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TOPIC_DOMAINS.map((domain) => {
          const Icon = domain.icon;
          return (
            <div
              key={domain.domain}
              className="flex flex-col justify-between p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {domain.domain}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {domain.description}
                    </p>
                  </div>
                </div>

                {/* Subfields Tags */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {domain.subfields.map((sub) => (
                    <Link
                      key={sub.name}
                      href={`/search?q=${encodeURIComponent(sub.query)}`}
                      className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                    >
                      <span>{sub.name}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Opportunities direct link for discipline */}
              {domain.opportunityDiscipline && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <Link
                    href={`/opportunities?discipline=${encodeURIComponent(domain.opportunityDiscipline)}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-indigo-700 dark:text-indigo-300 hover:underline"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Explore {domain.opportunityDiscipline} opportunities</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
