import MangoInfo from '@/components/common/MangoInfo'
import PageBanner from '@/components/common/PageBanner'
import SectionHeading from '@/components/common/SectionHeading'
import TypesOfMangoes from '@/components/common/TypesOfMangoes'
import React from 'react'

export default function page() {

    const mangotypes = [
            { "image": "/images/alph.png", "title": "Alphonso",      "location": "Maharashtra" },
            { "image": "/images/mango_2.png", "title": "Totapuri",      "location": "Karnataka" },
            { "image": "/images/mango_3.png", "title": "Banganpalli",   "location": "Andhra Pradesh" },
            { "image": "/images/mango_4.png", "title": "Dusheri",       "location": "Uttar Pradesh" },
            { "image": "/images/mango_5.png", "title": "Himsagar",      "location": "West Bengal" },
            { "image": "/images/mango_6.png", "title": "Kesar",         "location": "Gujarat" },
            { "image": "/images/mango_7.png", "title": "Langda",        "location": "Uttar Pradesh" },
            { "image": "/images/mango_8.png", "title": "Ambika",        "location": "Uttar Pradesh" },
            { "image": "/images/mango_9.png", "title": "Malgova",       "location": "Tamil Nadu, Karnataka" },
            { "image": "/images/mango_10.png", "title": "Vanraj",        "location": "Gujarat" },
            { "image": "/images/mango_11.png", "title": "Suvarnarekha",  "location": "Andhra, Odisha" },
            { "image": "/images/mango_12.png", "title": "Chaunsa",       "location": "Himachal, Bihar" }
        ]

    const kesarDetails = {
        alsoKnownAs: 'Safedi , Kesar is commonly also called the Queen of Mangoes.',
        origin: '(Western India) This is a famous variety of Saurashtra region of Gujarat. Grown in and around Ahmedabad, Gujarat, these are used primarily to make aamras in Gujarat.',
        season: 'June to Early July.',
        shape: 'Kesar is a small to medium fruit with a roundish shape and a distinct curved tip.',
        tasteTexture: 'A deep yellow-orange flesh, smooth and fragrant with intense sweetness.',
        characteristics: <ul className='list-disc pl-5 flex flex-col gap-2'>
                <li>Skin is edible.</li>
                <li>Mostly used to make preservatives.</li>
                <li>Fruits are medium sized.</li>
                <li>Flesh is sweet and fibreless.</li>
                <li>It has excellent sugar-acid blend.</li>
                <li>Fruits ripen to attractive apricot-yellow colour with a red blush.</li>
                <li>It has good processing quality.</li>
                <li>Its smell is its most distinguishing feature.</li>
                <li>The colour of the pulp resembling saffron, the spice it is named after.</li>
                <li>The skin is greener than most other mangoes.</li>
            </ul>,
        weight: 'These mangoes are medium sized, weighing on an average 225-250 grams.'
    }

    const banganapalliDetails = {
        alsoKnownAs: 'Safedi, Badami.',
        origin: 'Originally from the Andhra Pradesh town of banganapalli South India.',
        season: 'April – June.',
        shape: 'These mangoes are large in size, oblique to obliquely oval in shape with a thin skin dotted with light spots and a vibrant golden yellow colour.',
        tasteTexture: 'The pulpy fibreless texture, sweetness, moderate juice content.',
        characteristics: <ul className='list-disc pl-5 flex flex-col gap-2'>
                <li>Skin is edible.</li>
                <li>Weighs heavier than other mango varieties.</li>
                <li>The skin has a lovely bright yellow hue, and the taste is slightly sour.</li>
                <li>Fruits have good keeping quality.</li>
                <li>An unspoilt obliquely oval specimen presents an unblemished golden yellow thin edible skin.</li>
                </ul>,
        weight: 'These mangoes are large sized, weighing on an average 350-400 grams.'
    }

    const alphonsoDetails = {
        alsoKnownAs: 'King of Mangoes, Ratnagiri Alphonso mango known as Ratnagiri Hapus..',
        origin: '(Western India) It is mainly grown in the Ratnagiri area of Maharashtra and to a small extent in parts of South Gujarat and Karnataka.',
        season: 'June to Early July.',
        shape: 'Alphonso mangoes are small and oval in shape.',
        tasteTexture: 'Adorable fruit Cherish the delicate sweet taste with very little fiber and soft, Aromatic Golden saffron-hued color flesh and texture.',
        characteristics: <ul className='list-disc pl-5 flex flex-col gap-2'>
                <li>Fruits have higher content of pulp.</li>
                <li>In appearance: attractive blush towards the basal end.</li>
                <li>Pulp is firm, fibreless with excellent orange colour.</li>
                <li>It has good sugar/acid blend.</li>
                <li>Fruits have long shelf life and is the most exported variety.</li>
                <li>The flesh of the fruit is golden saffron colour.</li>
                <li>They have a rich, creamy, tender texture and are low in fibre content, with a delicate, creamy pulp.</li>                </ul>,
        weight: 'These mangoes are large sized, weighing on an average 350-400 grams.'
    }

    const langdaDetails = {
        alsoKnownAs: 'Langra, Langra means lame. It got its name from a 300 years old tale which depicts a lame or “langra” farmer who ate these mangoes and sowed its seeds in his farm.',
        origin: 'Langra mango is said to originate from Varanasi, current Banaras North India.',
        season: 'Langra Aam is available from May to August.',
        shape: 'Oval in shape. The stones or the seeds of Langras are small and oval.',
        tasteTexture: 'Its taste is outstandingly sweet. Its sweet taste can be easily determined by its strong and sweet aroma. The bright yellow flesh has less fibre and is super juicy.',
        characteristics: <ul className='list-disc pl-5 flex flex-col gap-2'>
            <li>All Langra mangoes have a skin of green or greenish-yellow colour, unlike other varieties of mangoes which turn yellow when ripe.</li>
            <li>The peel is thick and smooth.</li>
            <li>Its size ranges from medium to large.</li>
            <li>The flesh of these mangoes does not have any fibres.</li>
            <li>Mango is yellowish-brown in colour.</li>
        </ul>,
        weight: 'These mangoes are large sized, weighing on an average 350-400 grams.'
    }

    const TotapuriDetails = {
        alsoKnownAs: 'Bangalore, Collector, Kallamai, Kili Mooku Gilli, Mukku, “Ottu” Sandersha & Interestingly Totapuri also known as Ginimoothi Mavinakayi in Kannada literally translates to parrot’s beak (face).',
        origin: 'Found largely in Andhra Pradesh, Karnataka and Tamil Nadu and is partially cultivated in Sri Lanka.',
        season: 'May – July.',
        shape: 'Oblong in shape with an attractive green (raw) to golden yellow (fully ripe) colour. The inner flesh when fully ripe and ready to be processed is fibreless and looks a lot like Cadmium Yellow colour.',
        tasteTexture: "Totapuri is generally mild to tangy in taste and often cut into pieces and partaken with salt and chilli powder sprinkled over it. The skin of a Totapuri mango is usually eaten alongside the fruit’s flesh due to its lack of or mild bitterness compared to other mango varieties’ skins.",
        characteristics: <ul className='list-disc pl-5 flex flex-col gap-2'>
            <li>Their unique tangy and slightly sour taste can provide an interesting twist to mango-based desserts and chutneys.</li>
            <li>Their unique flavour and firm texture make them popular among pickle enthusiasts.</li>
            <li>It is most popularly used in processed mango products.</li>
            <li>Fruits have good keeping quality.</li>
            <li>This mango has a piquant flavour, something different from the other sweet varieties of mangoes available.</li>
        </ul>,
        weight: 'These mangoes are large sized, weighing on an average 350-400 grams.'
    }

    const chaunsaDetails = {
        alsoKnownAs: 'The name ”Chaunsa” is derived from Urdu and means “sucker”. It reflects the irresistible taste of the chaunsa mango.',
        origin: 'Chaunsa mangoes are cultivated in the Northern regions of India, particularly in the states of Uttar Pradesh and Bihar.',
        season: 'The harvesting season typically spans from June to August.',
        shape: 'Their medium-sized, oblong shape fits perfectly in your hand, making them easy to eat.',
        tasteTexture: "One bite reveals the velvety smooth texture and abundant juice that characterizes this exquisite fruit. With its intoxicating aroma and tantalizingly sweet taste, Chaunsa mangoes are often described as a blend of honey and tropical paradise.",
        characteristics: <ul className='list-disc pl-5 flex flex-col gap-2'>
            <li>Chaunsa mango is a medium-sized fruit with a thin, yellowish-green skin that turns to golden yellow as it ripens.</li>
            <li>The flesh is soft, juicy, and fibreless, with a sweet and aromatic flavour.</li>
            <li>The seed is small and oblong, and the fruit has relatively high pulp content.</li>        </ul>,
        weight: 'Around 300-350 grams.'
    }

    const dasheriDetails = {
        alsoKnownAs: 'There are several regional names for Dasheri mangoes are also well-known throughout India for their role in breeding new mango varieties.',
        origin: 'Dasheri mangoes are native to a village near Malihabad within Lucknow, a district just south of the Nepal border in the state of Uttar Pradesh in Northern India. Dasheri mangoes eventually spread in cultivation and are grown throughout Northern India and Southern India in Andhra Pradesh.',
        season: 'The harvesting season typically spans from June to August.',
        shape: 'Dasheri mangoes are small to medium-sized fruits, averaging 9 to 15 centimetres in length, and have an elongated, straight oval shape with blunt, curved ends.',
        tasteTexture: "Dasheri mangos are favoured for their sweet flavour and juicy, smooth flesh and are a prized seasonal summer fruit utilized in raw and cooked preparations. The skin is semi-thick, smooth, leathery, and subtly waxy.",
        characteristics: <ul className='list-disc pl-5 flex flex-col gap-2'>
            <li>The orange flesh is tender, succulent, and almost entirely fibreless, encasing a moderately-sized stone.</li>
            <li>Ranging in colour from light green to yellow-green, transforming into a golden yellow hue when ripe.</li>
            <li>The fruit’s flesh is very sweet and contains tropical, fruity, and mildly tangy nuances.</li>
            <li>Dasheri mangoes contain phytochemicals in the skin that may have antioxidant-like properties to reduce inflammation.</li>
            </ul>,
        weight: 'Around 300-350 grams.'
    }

    const neelamDetails = {
        alsoKnownAs: 'Neelam mangoes are also commonly referred to as “Neelum” mangoes.',
        origin: 'This is a commercial variety indigenous to Tamil Nadu. Neelam mangoes are primarily cultivated in Karnataka, Tamil Nadu, and Andhra Pradesh.',
        season: 'Neelam Mangos are a late to very late season mango and are usually ripe and ready to pick between July – September.',
        shape: 'They have a shape of a fat cashew nut (Ovate Oblique). They are smooth-skinned and bright yellow upon ripening and have no blush. The flesh is deep yellow or orange.',
        tasteTexture: "Neelam Mangos have pale to deep yellow fiberless flesh (depending on ripeness) with a compact and firm texture, Neelam Mangos have a very sweet Indian flavor (Combination of sweet and sour). Furthermore, there is a strong sub-acid component, notes of resin as well as a VERY intense spice flavor.",
        characteristics: <ul className='list-disc pl-5 flex flex-col gap-2'>
            <li>The orange flesh is tender, succulent, and almost entirely fibreless, encasing a moderately-sized stone.</li>
            <li>Fruit quality is good and keeping quality is very good. Small &amp; compact.</li>
            <li>Neelum mango is considered a “condo” mango, or a mango that does well in containers.</li>
            <li>The trees have a low spreading growth habit, and the leaves are long, thin and distinctive with a prominent floral aroma.</li>
            </ul>,
        weight: 'Each mango weighs approximately 150 to 300 grams.'
    }

    const rajapuriDetails = {
        alsoKnownAs: 'It is named after the town of Rajapur, which is located in the Ratnagiri district of Maharashtra.',
        origin: 'Rajapuri mangoes are primarily grown in Northern India, particularly in the regions of Maharashtra and Gujarat.',
        season: 'The Rajapuri mango is available from March to July.',
        shape: 'Rajapuri mangoes are Large sized fruits, averaging 12 to 18 centimetres in length, and have an elongated, straight oval shape with blunt, curved ends.',
        tasteTexture: "Rajapuri Mango is exceptionally sweet. This fruit is incredibly juicy and has a delicate, velvety texture that melts in your mouth. Its flavor is a perfect balance of sweetness and acidity, with a subtle undertone of tropical fruit.",
        characteristics: <ul className='list-disc pl-5 flex flex-col gap-2'>
            <li>Rajapuri mango is an oversized juicy mango.</li>
            <li>Rajapuri mangoes are highly aromatic and bear a tropical, nectar-like scent.</li>
            <li>This mango has a soft and light-coloured pulp.</li>
            <li>Rajapuri mango is low in calories and high in antioxidants.</li>
        </ul>,
        weight: 'Rajapuri Mango is a large fruit that typically weighs between 350-400 grams.'
    }


  return (
    <div className='flex flex-col'>
        <PageBanner
            title="Mangopedia"
            minorTitle="mango bite"
            description="From Seed to Savor: Our Incredible Mango Journey."
            breadCrumbs={[
                { label: 'Mangopedia'},
            ]}
        />

        <div className="py-12 px-8">
            <div className="flex flex-col gap-12 max-w-7xl mx-auto">
                <SectionHeading
                    minorHeading="types"
                    mainHeading="types of mangoes"
                />
                <TypesOfMangoes mangoeTypes={mangotypes} />
            </div>
        </div>

        <div className="py-12 px-8">
            <div className="flex flex-col gap-12 max-w-7xl mx-auto">
                <MangoInfo title='About Banganpalli Mango' details={banganapalliDetails} />
                <MangoInfo title='About Kesar Mango' details={kesarDetails} />
                <MangoInfo title='About Alphonso Mango' details={alphonsoDetails} />
                <MangoInfo title='About Langda Mango' details={langdaDetails} />
                <MangoInfo title='About Totapuri Mango' details={TotapuriDetails} />
                <MangoInfo title='About Chaunsa Mango' details={chaunsaDetails} />
                <MangoInfo title='About Dasheri Mango' details={dasheriDetails} />
                <MangoInfo title='About Neelam Mango' details={neelamDetails} />
                <MangoInfo title='About Rajapuri Mango' details={rajapuriDetails} />
            </div>
        </div>


      
    </div>
  )
}
