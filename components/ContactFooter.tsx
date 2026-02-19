
import React from 'react';
import { useContent } from '../ContentContext';
import Logo from './Logo';

const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);
const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
    </svg>
);
const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);


const ContactFooter: React.FC = () => {
    const { content } = useContent();

    return (
        <footer id="contact" className="bg-pdi-dark-blue text-white scroll-mt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
                    <div className="md:col-span-1">
                        <div className="flex justify-center md:justify-start mb-4">
                            <Logo
                                src={content.branding.logoBottom}
                                className="h-auto w-auto object-contain"
                                style={{ maxHeight: `${content.branding.logoBottomSize || 150}px`, maxWidth: `${content.branding.logoBottomSize || 150}px` }}
                            />
                        </div>
                        <p className="text-gray-400">Redefining education through locally relevant, globally informed, and technology-enhanced solutions.</p>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-xl font-bold mb-6 text-center">Contact Us</h3>
                        <div className="grid sm:grid-cols-3 gap-8">
                            <div className="flex flex-col items-center">
                                <MailIcon className="w-8 h-8 text-pdi-red mb-3" />
                                <h4 className="font-semibold">Email</h4>
                                <a href={`mailto:${content.contactInfo.email}`} className="text-gray-300 hover:text-pdi-red transition-colors">{content.contactInfo.email}</a>
                            </div>
                            <div className="flex flex-col items-center">
                                <img src="/icons/phone.svg" className="w-8 h-8 mb-3" alt="Phone" />
                                <h4 className="font-semibold">Phone</h4>
                                <a href={`tel:${content.contactInfo.phone}`} className="text-gray-300 hover:text-pdi-red transition-colors">{content.contactInfo.phone}</a>
                            </div>
                            <div className="flex flex-col items-center">
                                <MapPinIcon className="w-8 h-8 text-pdi-red mb-3" />
                                <h4 className="font-semibold">Address</h4>
                                <p className="text-gray-300">{content.contactInfo.address}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-black/20 py-4">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} Personal Development Initiative Africa Ltd. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default ContactFooter;
