import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    alert("Thank you for your message! We'll get back to you soon.");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-lg h-fit">
              <h2 className="font-display font-bold text-2xl text-neutral-900 mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">
                      Our Office
                    </h3>
                    <p className="text-neutral-600">
                      Thamel, Kathmandu
                      <br />
                      Nepal, 44600
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">
                      Phone
                    </h3>
                    <p className="text-neutral-600">
                      +977-1-4441234
                      <br />
                      +977-9841234567
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">
                      Email
                    </h3>
                    <p className="text-neutral-600">
                      info@himalayaadventure.com
                      <br />
                      booking@himalayaadventure.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">
                      Office Hours
                    </h3>
                    <p className="text-neutral-600">
                      Sunday - Friday: 9:00 - 18:00
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-accent-50 rounded-lg">
                <h3 className="font-semibold text-accent-800 mb-2">
                  Emergency Contact
                </h3>
                <p className="text-sm text-accent-700">
                  24/7 emergency support during your trek:
                  <br />
                  <strong>+977-9841234567</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="font-display font-bold text-2xl text-neutral-900 mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-neutral-700 mb-2"
                    >
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="trek-inquiry">Trek Inquiry</option>
                      <option value="booking">Booking Question</option>
                      <option value="custom-trek">Custom Trek Request</option>
                      <option value="equipment">Equipment Question</option>
                      <option value="general">General Information</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-neutral-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                    placeholder="Tell us about your trekking plans, questions, or how we can help you..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-600">* Required fields</p>

                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="font-display font-bold text-2xl text-neutral-900 mb-6 text-center">
              Find Us in Kathmandu
            </h2>

            {/* Placeholder for Google Maps */}
            <div className="bg-neutral-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">
                  Interactive map would be embedded here
                  <br />
                  showing our office location in Thamel, Kathmandu
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-3xl text-neutral-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-neutral-600">
              Quick answers to common questions about our treks and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-900 mb-3">
                What's included in the trek price?
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Our trek prices include accommodation, meals during the trek,
                professional guide and porter services, permits, and domestic
                airport transfers. International flights and personal expenses
                are not included.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-900 mb-3">
                Do I need travel insurance?
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Yes, comprehensive travel insurance including helicopter
                evacuation coverage is mandatory for all our treks. We can
                recommend suitable insurance providers.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-900 mb-3">
                What fitness level is required?
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Fitness requirements vary by trek. Generally, good
                cardiovascular fitness and ability to walk 6-8 hours daily is
                recommended. We provide detailed fitness guidelines for each
                trek.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-900 mb-3">
                Can I customize my trek?
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Absolutely! We specialize in customized treks tailored to your
                preferences, fitness level, and time constraints. Contact us to
                discuss your dream trek.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
