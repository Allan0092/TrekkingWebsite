import { Award, Globe, Heart, Shield } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Safety First",
      description:
        "Your safety is our top priority. We maintain the highest safety standards with experienced guides and comprehensive emergency protocols.",
    },
    {
      icon: Heart,
      title: "Authentic Experiences",
      description:
        "We create genuine connections with local communities and provide authentic cultural experiences that respect traditional ways of life.",
    },
    {
      icon: Globe,
      title: "Sustainable Tourism",
      description:
        "We are committed to responsible tourism practices that protect the environment and benefit local communities.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We strive for excellence in every aspect of our service, from trip planning to execution, ensuring unforgettable experiences.",
    },
  ];

  const team = [
    {
      name: "Hari Gautam",
      role: "Founder & Lead Guide",
      image: "/images/person1.png",
      experience: "15+ years",
      description:
        "Everest summiteer with extensive high-altitude experience and deep knowledge of Himalayan culture.",
    },
    {
      name: "Martin Gautam",
      role: "Operations Manager",
      image: "/images/person2.png",
      experience: "3+ years",
      description:
        "Expert in logistics and customer service, ensuring seamless trekking experiences for all our clients.",
    },
    {
      name: "Allan Gautam",
      role: "IT Department",
      image: "/images/person3.png",
      experience: "5+ years",
      description: "Certified in the technical department.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 lg:h-[500px] overflow-hidden">
        <img
          src="/images/man-looking-out.jpeg"
          alt="About Nepal Trekking"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50 "></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="font-display font-bold text-4xl lg:text-6xl mb-6">
              Our Story
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-200 leading-relaxed">
              Passionate about the Himalayas, dedicated to authentic experiences
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl lg:text-4xl text-neutral-900 mb-6">
            Our Mission
          </h2>
          <p className="text-lg lg:text-xl text-neutral-700 max-w-4xl mx-auto leading-relaxed">
            We are dedicated to providing safe, authentic, and transformative
            trekking experiences in the Nepal Himalayas. Our mission is to
            create lasting memories while supporting local communities and
            preserving the natural beauty of the mountains for future
            generations.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="font-display font-bold text-2xl lg:text-3xl text-neutral-900 mb-6">
              How We Started
            </h3>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                Himalaya Adventures was founded in 2010 by Hari Gautam, a guide
                with over 15 years of experience in the Himalayas and Nepal.
                Growing up in the remote region, he witnessed firsthand the
                beauty and challenges of mountain life.
              </p>
              <p>
                After guiding hundreds of trekkers from around the world, Hari
                realized the need for a trekking company that truly understood
                both the mountains and the people who call them home. He
                envisioned a company that would provide exceptional service
                while giving back to local communities.
              </p>
              <p>
                Today, we are proud to be one of Nepal's most trusted trekking
                companies, with a team of experienced guides, porters, and
                support staff who share our passion for the mountains and
                commitment to excellence.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="/images/small-village.jpeg"
              alt="Nepal mountain village"
              className="w-full rounded-2xl shadow-lg"
            />
            <div className="absolute -bottom-6 -right-6 bg-primary-600 text-white p-6 rounded-2xl">
              <div className="text-3xl font-bold mb-1">500+</div>
              <div className="text-primary-100">Happy Trekkers</div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="font-display font-bold text-3xl lg:text-4xl text-neutral-900 mb-4">
              Our Values
            </h3>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              These core principles guide everything we do and shape every
              experience we create.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="flex space-x-6 p-6 bg-neutral-50 rounded-2xl"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xl text-neutral-900 mb-3">
                      {value.title}
                    </h4>
                    <p className="text-neutral-700 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="font-display font-bold text-3xl lg:text-4xl text-neutral-900 mb-4">
              Meet Our Team
            </h3>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Our experienced team of guides and support staff are passionate
              about sharing the beauty of the Himalayas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="text-center bg-white border border-neutral-200 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-display font-bold text-xl text-neutral-900 mb-2">
                  {member.name}
                </h4>
                <div className="text-primary-600 font-medium mb-2">
                  {member.role}
                </div>
                <div className="text-sm text-neutral-600 mb-4">
                  {member.experience} experience
                </div>
                <p className="text-neutral-700 leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-neutral-800 rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-100">Happy Trekkers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-primary-100">Trek Routes</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">20+</div>
              <div className="text-primary-100">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99%</div>
              <div className="text-primary-100">Success Rate</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="font-display font-bold text-3xl text-neutral-900 mb-6">
            Ready for Your Adventure?
          </h3>
          <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
            Join us for an unforgettable journey through the world's most
            spectacular mountains.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/packages"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              Explore Treks
            </a>
            <a
              href="/contact"
              className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-lg hover:bg-primary-600 hover:text-white transition-colors font-semibold"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
