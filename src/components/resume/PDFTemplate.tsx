import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register a professional font if available, or use defaults
// Font.register({ family: 'Inter', src: 'https://fonts.gstatic.com/s/inter/v12/UcCOjFGCW6YXdXfHRnJYOAZVny5V7VdbTeWpJuA.woff2' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottom: '1pt solid #eee',
    paddingBottom: 10,
    textAlign: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  contact: {
    fontSize: 9,
    color: '#666',
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000',
    textTransform: 'uppercase',
    borderBottom: '1pt solid #eee',
    marginBottom: 8,
    paddingBottom: 2,
  },
  item: {
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  company: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  duration: {
    fontSize: 9,
    color: '#666',
  },
  title: {
    fontSize: 10,
    fontStyle: 'italic',
    marginBottom: 2,
  },
  description: {
    fontSize: 9,
    color: '#444',
    textAlign: 'justify',
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skill: {
    backgroundColor: '#f3f4f6',
    padding: '2 6',
    borderRadius: 4,
    fontSize: 8,
  },
});

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  experience: Array<{ company: string; title: string; duration: string; description: string }>;
  education: Array<{ institution: string; degree: string; field: string; year: string }>;
  skills: string[];
  projects: Array<{ name: string; description: string; tech: string; link?: string }>;
}

export const PDFTemplate = ({ data }: { data: ResumeData }) => (
  <Document title={`${data.name} - Resume`}>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.name || 'Your Name'}</Text>
        <Text style={styles.contact}>
          {[data.email, data.phone, data.location, data.linkedin].filter(Boolean).join('  |  ')}
        </Text>
      </View>

      {/* Summary */}
      {data.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.description}>{data.summary}</Text>
        </View>
      )}

      {/* Experience */}
      {data.experience.some(e => e.company) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {data.experience.filter(e => e.company).map((exp, i) => (
            <View key={i} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.company}>{exp.company}</Text>
                <Text style={styles.duration}>{exp.duration}</Text>
              </View>
              <Text style={styles.title}>{exp.title}</Text>
              <Text style={styles.description}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {data.skills.some(s => s) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills & Technologies</Text>
          <View style={styles.skills}>
            {data.skills.filter(Boolean).map((skill, i) => (
              <Text key={i} style={styles.skill}>{skill}</Text>
            ))}
          </View>
        </View>
      )}

      {/* Projects */}
      {data.projects.some(p => p.name) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Projects</Text>
          {data.projects.filter(p => p.name).map((proj, i) => (
            <View key={i} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.company}>{proj.name}</Text>
                {proj.link && <Text style={styles.duration}>{proj.link}</Text>}
              </View>
              <Text style={styles.description}>{proj.description}</Text>
              {proj.tech && <Text style={[styles.description, { fontStyle: 'italic', marginTop: 2 }]}>Tech: {proj.tech}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {data.education.some(e => e.institution) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.filter(e => e.institution).map((edu, i) => (
            <View key={i} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.company}>{edu.institution}</Text>
                <Text style={styles.duration}>{edu.year}</Text>
              </View>
              <Text style={styles.title}>{edu.degree} in {edu.field}</Text>
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);
