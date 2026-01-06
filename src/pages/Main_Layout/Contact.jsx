import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Headphones, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Footer from '../../components/Footer';

const Contact = () => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });

        setTimeout(() => setSubmitted(false), 5000);
    };

    const contactInfo = [
        {
            icon: Mail,
            title: t("email"),
            value: "support@fitvibe.com",
            description: t("respond_time")
        },
        {
            icon: Phone,
            title: t("phone"),
            value: "+1 (555) 123-4567",
            description: t("business_hours_short")
        },
        {
            icon: MessageSquare,
            title: t("live_chat"),
            value: t("available_now"),
            description: t("instant_help")
        }
    ];

    const quickHelp = [
        { icon: Headphones, title: t("order_support"), description: t("order_support_desc") },
        { icon: Clock, title: t("size_guide"), description: t("size_guide_desc") },
        { icon: MapPin, title: t("shipping_info"), description: t("shipping_info_desc") }
    ];

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen mt-[10vh] ">

            {/* Header */}
            <section className="bg-gray-50 dark:bg-gray-900 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        {t("contact_us")}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t("contact_desc")}
                    </p>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 mb-16">

                        {contactInfo.map((contact, index) => {
                            const Icon = contact.icon;
                            return (
                                <div 
                                    key={index} 
                                    className="text-center p-6 rounded-2xl 
                                            bg-gray-50 dark:bg-gray-800 
                                            hover:bg-gray-100 dark:hover:bg-gray-700 
                                            transition-colors duration-200"
                                >
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        {contact.title}
                                    </h3>

                                    <p className="text-blue-600 dark:text-blue-400 font-medium mb-1">
                                        {contact.value}
                                    </p>

                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {contact.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Form + Sidebar */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-12">

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    {t("send_message")}
                                </h2>

                                {submitted && (
                                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-xl flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-300" />
                                        <span className="text-green-800 dark:text-green-200 font-medium">
                                            {t("message_success")}
                                        </span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {t("name_label")}
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 
                                                        bg-white dark:bg-gray-700 
                                                        text-gray-900 dark:text-white 
                                                        rounded-xl focus:ring-2 focus:ring-blue-500"
                                                placeholder={t("name_placeholder")}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {t("email_label")}
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 
                                                        bg-white dark:bg-gray-700 
                                                        text-gray-900 dark:text-white 
                                                        rounded-xl focus:ring-2 focus:ring-blue-500"
                                                placeholder={t("email_placeholder")}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t("subject_label")}
                                        </label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 
                                                    bg-white dark:bg-gray-700 
                                                    text-gray-900 dark:text-white 
                                                    rounded-xl focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option className="dark:bg-gray-700" value="">
                                                {t("select_topic")}
                                            </option>
                                            <option className="dark:bg-gray-700" value="order">{t("order_question")}</option>
                                            <option className="dark:bg-gray-700" value="return">{t("returns_exchanges")}</option>
                                            <option className="dark:bg-gray-700" value="sizing">{t("size_help")}</option>
                                            <option className="dark:bg-gray-700" value="product">{t("product_info")}</option>
                                            <option className="dark:bg-gray-700" value="shipping">{t("shipping_delivery")}</option>
                                            <option className="dark:bg-gray-700" value="other">{t("other")}</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t("message_label")}
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 
                                                    bg-white dark:bg-gray-700 
                                                    text-gray-900 dark:text-white 
                                                    rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                                            placeholder={t("message_placeholder")}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white 
                                                font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                {t("sending")}
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                {t("send_message")}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    {t("quick_help")}
                                </h3>

                                <div className="space-y-4">
                                    {quickHelp.map((item, index) => {
                                        const Icon = item.icon;

                                        return (
                                            <div 
                                                key={index} 
                                                className="flex items-start gap-3 p-3 rounded-xl 
                                                        hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                                    <Icon className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                                                </div>

                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 bg-gray-900 dark:bg-black text-white text-center">
                <h2 className="text-3xl font-bold mb-4">{t("need_answers")}</h2>
                <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                    {t("faq_desc")}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl">
                        {t("view_faq")}
                    </button>
                    <button className="border border-gray-300 dark:border-gray-700 text-gray-200 font-semibold px-8 py-3 rounded-xl">
                        {t("help_center")}
                    </button>
                </div>
            </section>

            <Footer />

        </div>

    );
};

export default Contact;
