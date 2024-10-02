import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen flex items-center">
      <div className="max-w-xl mx-auto">
        <div className="flex flex-col justify-center items-center gap-8 text-center p-3 mb-20">
          <h1 className="text-4xl font-semibold">
            Welcome to Lahiru&#39;s Blog
          </h1>
          <p className="">
            Lahiru&#39;s Blog is a blog website that I created to share my
            thoughts and ideas with the world. As an IT undergraduate, I love to
            write about the things I&#39;ve learned and experienced so far. I
            hope you&#39;ll enjoy reading my blogs here.
          </p>
          <p className="">
            <table>
              hrou this blog website, you can find various insightsful articles
              about different frontend, backend technologies as well as
              programming languages
            </table>
          </p>
          <p className="">
            Join me as we explore the ever-evolving world of development
            together!
          </p>
          <Link to={'/search'}>
            <Button gradientDuoTone={'purpleToPink'} className="w-fit">Continue Reading</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
