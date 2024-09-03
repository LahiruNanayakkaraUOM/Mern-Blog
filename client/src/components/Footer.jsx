import { Footer, FooterCopyright, FooterDivider, FooterLinkGroup, FooterTitle } from "flowbite-react";
import { BsFacebook, BsInstagram, BsTwitterX, BsDribbble, BsGithub } from 'react-icons/bs'
import { Link } from "react-router-dom";

const FooterCom = () => {
  return (
    <Footer className="border border-t-8 border-teal-500 p-8">
      <div className="w-full max-w-7xl">
        <div className="grid w-full justify-between  sm:flex md:grid-cols-1">
          <div className="">
            <Link to="/" className="self-center whitespace-nowrap text-sm
            sm:text-xl font-semibold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500
            via-purple-500 to-pink-500 rounded-lg text-white me-2">Lahiru&#39;s</span>
            Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 mt-8 sm:mt-2 sm:grid-cols-3 gap-8 sm:gap-6">
            <div>
                <FooterTitle title="About" />
                <FooterLinkGroup col>
                    <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                        About Us
                    </Footer.Link>
                    <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                        Blogs
                    </Footer.Link>
                    <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                        Contact
                    </Footer.Link>
                </FooterLinkGroup>
            </div>
            <div>
                <FooterTitle title="Follow Us" />
                <FooterLinkGroup col>
                    <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                        About Us
                    </Footer.Link>
                    <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                        Blogs
                    </Footer.Link>
                    <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                        Contact
                    </Footer.Link>
                </FooterLinkGroup>
            </div>
            <div>
                <FooterTitle title="Legel" />
                <FooterLinkGroup col>
                    <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                        About Us
                    </Footer.Link>
                    <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                        Blogs
                    </Footer.Link>
                    <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                        Contact
                    </Footer.Link>
                </FooterLinkGroup>
            </div>
          </div>
        </div>
        <FooterDivider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
        <FooterCopyright by="Lahiru's Blog" year={new Date().getFullYear()} />
        <div className="flex gap-2 mt-4 sm:mt-0">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsTwitterX} />
            <Footer.Icon href="#" icon={BsDribbble} />
        </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterCom;
