const infrastructureCards = [
  {
    alt: 'Workstation',
    dataAlt:
      'High-end dual monitor workstation setup in a modern dark office environment, glowing ambient lighting, professional tech space',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDe3dI_UeRG8MAEBEMgFDXXRwju0bBup-H1ZtHM4SnZGzIDpxFyqLKlB1B_6Uj9W9wRzp0iQ2UfwJG9I0FhLfNshOCBjeEL_C4WuPXHtEWIBObI6uPtpo9e6u7lqJgSrf-zhlSuZYw0DPwlJ2CvWK9efeMij6vbQfOr2nsid-Lj1aH_IEp6bwsPq6DFwcwJid74D9kVwLer8ky3nLFCgSKoOsp1X0oe5I1Sn6OZoPJWukj2mxumBA6Yyrl3_bQnKwGSZRRQPQHlX6A',
    title: 'PC e Workstation',
    description:
      'Assemblaggio e configurazione di macchine per qualsiasi esigenza operativa.'
  },
  {
    alt: 'Server',
    dataAlt:
      'Rows of blinking server racks in a secure data center, cool blue lighting, depth of field, enterprise infrastructure',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAufb96DUrT7y8S3R4x0oD177OPYxmWLBt1RE9zumFaLHQrhpv6oQd9iiJZVJka5l_wLFXx80Tnypz1CvDAby7TiyG20tQxfhzjGwy4GLLK0SM1h4pruq1rpJ7kVoND_-AiDntI_wrm2WyCOZ1zlVih7TfouJeLzGk6NDFw_2pDQ28lcH87Fg_turFGtxZPCWUFFygoH8TGRhUB-rzQ_YNYYc9fIKhEPvZmvsfDrVRLzLV_VENcztooh6-aBxXUEIGxHMlhnydcUo',
    title: 'Server Privati',
    description:
      'Per la gestione dei tuoi dati e la sicurezza e l\'autonomia della tua attività.'
  },
  {
    alt: 'Security',
    dataAlt:
      'Abstract visualization of digital security lock over binary code background, representing cybersecurity and data protection',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnRD50G054QtGxKd__hr0vt2sJrcmzp4X0D51SnAp4owA4wSv_PlMBdfw3QWUJBShWE45ZTVFfqoB3Tza_VOEXyX5623XsXGeKLgZofBiNXdyIlMX7q3r7LX6cxxPy7iCcSHzz6eZccf-DQkZSHM-CrmW2XtX5uKPNpztVLS03zVu62wXNh0ZHlXw9-UyABJpiv0gvhmzJ_vimOerPsdHBoSKAKqMi1Sulxn2uNEqn-8fmeLusZtwytMOvUSouEIbd48c3_N8D_Io',
    title: 'Sicurezza Informatica',
    description:
      'Sistemi di backup e protezione, fisici e virtuali, per la salvaguardia del tuo business.'
  }
];

export default function InfrastructureSection() {
  return (
    <section className="py-24 bg-surface" id="infrastruttura">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-surface-container-high pb-8 border-transparent">
          <div className="max-w-2xl">
            <h2 className="font-headline text-3xl md:text-4xl tracking-tight text-on-background mb-4">Infrastruttura Hardware</h2>
            <p className="font-body text-on-surface-variant">
              Le fondamenta fisiche e virtuali per garantire continuità operativa e sicurezza dei dati.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {infrastructureCards.map((card) => (
            <div key={card.title} className="group">
              <div className="h-48 rounded-xl bg-surface-container-high mb-6 overflow-hidden">
                <img
                  alt={card.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  data-alt={card.dataAlt}
                  src={card.src}
                />
              </div>
              <h3 className="font-headline text-xl font-bold text-on-background mb-2">{card.title}</h3>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
